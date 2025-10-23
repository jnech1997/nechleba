import { Component, OnInit, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

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

  constructor(private translate: TranslateService) {}

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
}
