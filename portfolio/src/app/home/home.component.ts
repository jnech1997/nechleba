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
    function getCountdown() {
      const targetDate = new Date("February 2, 2026 00:00:00").getTime();
      const now = new Date().getTime();
      const distance = targetDate - now;
      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance <= 0) {
        return []
      }
      else {
        return [days, hours, minutes, seconds];
      }
    }

    if (this.mobileQuery.matches) {
      const times = getCountdown();
      if (times.length > 0) {
        const days = times[0];
        document.getElementById("timeToOdoo").innerHTML = (days + " days");
      }
    }
    else {
      this.timer_id = setInterval(function() {
        const times = getCountdown();
        if (times.length > 0) {
          const days = times[0];
          const hours = times[1];
          const minutes = times[2];
          const seconds = times[3];
          document.getElementById("timeToOdoo").innerHTML = days + "d :: " + hours + "h :: " + minutes + "m :: " + seconds + "s";
        }
      }, 1000);
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
