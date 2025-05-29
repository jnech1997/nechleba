import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {

  /* Set spinner */
  loading = true;

  constructor(private translate: TranslateService) { }

  /** On load of the home screen image, set loading tracker to false */
  onLoad() : void {
    this.loading = false
  }

  ngOnInit() {
    this.updateClock();
  }

  updateClock() {
    let now = new Date().toLocaleString(); // current date
    // set the content of the element with the ID time to the formatted string
    let timeNode = document.getElementById('currentTime')
    if (!!timeNode) {
      timeNode.innerHTML = now;
    }
    // call this function again in 1000ms
    setInterval(this.updateClock, 1000);
  }

}
