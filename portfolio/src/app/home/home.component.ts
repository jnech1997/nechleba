import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ServerService } from "../services/server.service";
import { MediaMatcher } from "@angular/cdk/layout";

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
  timer_id: any;
  timestamp: number = Date.now();
  @HostListener("scroll", ["$event"]) public scrolled($event: Event) {
    this.scrolledDown = true;
  }
  mobileQuery: MediaQueryList;

  constructor(
    private translate: TranslateService,
    private server: ServerService,
    public media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 900px)");
  }

  /** On load of the home screen image, set loading tracker to false */
  onLoad(): void {
    this.loading = false;
  }

  ngOnInit() {
    this.updateClock();
  }

  updateClock() {
    let now = new Date().toLocaleString(); // current date
    // set the content of the element with the ID time to the formatted string
    if (this.mobileQuery.matches) {
      // stop the timer on mobile devices to save resources
      now = new Date().toDateString();
    }
    let timeNode = document.getElementById("currentTime");
    if (!!timeNode) {
      timeNode.innerHTML = now;
    }
    if (!this.mobileQuery.matches) {
      // call this function again in 1000ms
      this.timer_id = setInterval(() => this.updateClock(), 1000);
    }
  }

  /** Smooth scroll to element on the page */
  scrollTo(element: any): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    // optimistic UI: hide the button after triggering the scroll
    this.scrolledDown = true;
  }

  handleEnterKey(
    event: KeyboardEvent,
    messageInput: HTMLTextAreaElement
  ): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline insertion
      const message = messageInput.value;
      this.sendEmail(message);
      messageInput.value = ""; // Clear the input after sending
    }
  }

  /** Send the user's message using the default mail client via mailto: */
  sendEmail(message: string): void {
    if (!message || !message.trim()) return;
    const request = this.server
      .request("POST", "/contact", {
        message: message,
      })
      .subscribe(
        (response: any) => {
          // console.log("Email sent successfully:", response);
        },
        (error: any) => {
          console.error("Error sending email:", error);
        }
      );
  }

  ngOnDestroy(): void {
    if (!this.mobileQuery.matches) {
      clearInterval(this.timer_id);
    }
  }
}
