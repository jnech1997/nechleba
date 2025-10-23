import { Component, OnInit, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ServerService } from "../services/server.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: false,
})
export class HomeComponent implements OnInit {
  /* Set spinner */
  loading = true;
  scrolledToBottom = false;
  @HostListener("scroll", ["$event"]) public scrolled($event: Event) {
    this.checkIfAtBottom();
  }

  constructor(
    private translate: TranslateService,
    private server: ServerService
  ) {}

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
    let timeNode = document.getElementById("currentTime");
    if (!!timeNode) {
      timeNode.innerHTML = now;
    }
    // call this function again in 1000ms
    setInterval(() => this.updateClock(), 1000);
  }

  /** Smooth scroll to element on the page */
  scrollTo(element: any): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
    // optimistic UI: hide the button after triggering the scroll
    this.scrolledToBottom = true;
  }

  checkIfAtBottom(): void {
    if (typeof window === "undefined") return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement?.scrollHeight || 0
    );
    // consider near-bottom within 30px as bottom
    this.scrolledToBottom = scrollPosition >= docHeight - 30;
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
}
