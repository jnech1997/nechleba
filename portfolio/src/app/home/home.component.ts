import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { ServerService } from "../services/server.service";
import { MediaMatcher } from "@angular/cdk/layout";

const ODOO_START_DATE = "2/02/2026";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  /* Set spinner */
  loading = true;
  scrolledDown = false;
  clockText = "";
  emailStatus: "" | "sending" | "sent" | "failed" = "";
  private timerId?: ReturnType<typeof setInterval>;
  mobileQuery: MediaQueryList;

  @HostListener("scroll") public scrolled() {
    this.scrolledDown = true;
  }

  constructor(private server: ServerService, public media: MediaMatcher) {
    this.mobileQuery = media.matchMedia("(max-width: 900px)");
  }

  /** On load of the home screen image, set loading tracker to false */
  onLoad(): void {
    this.loading = false;
  }

  ngOnInit() {
    this.updateClock();
    // On mobile, show only the date and skip the per-second timer.
    if (!this.mobileQuery.matches) {
      this.timerId = setInterval(() => this.updateClock(), 1000);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

  private updateClock() {
    const now = this.mobileQuery.matches
      ? new Date().toDateString()
      : new Date().toLocaleString();
    this.clockText = `${ODOO_START_DATE} - ${now}`;
  }

  /** Smooth scroll to element on the page */
  scrollTo(element: string): void {
    document.getElementById(element)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    // optimistic UI: hide the button after triggering the scroll
    this.scrolledDown = true;
  }

  handleEnterKey(event: Event, messageInput: HTMLTextAreaElement): void {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.shiftKey) return; // Shift+Enter inserts a newline
    keyEvent.preventDefault();
    if (this.sendEmail(messageInput.value)) {
      messageInput.value = "";
    }
  }

  /** Send the message through the API. Returns false if nothing was sent. */
  sendEmail(message: string): boolean {
    if (!message?.trim() || this.emailStatus === "sending") return false;
    this.emailStatus = "sending";
    this.server.request("POST", "/contact", { message }).subscribe({
      next: () => (this.emailStatus = "sent"),
      error: (error: unknown) => {
        console.error("Error sending email:", error);
        this.emailStatus = "failed";
      },
    });
    return true;
  }
}
