import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: false
})
export class AboutComponent implements OnInit {

  constructor(private translate: TranslateService) {
    
  }

  ngOnInit() {
    this.updateClock();
  }

  updateClock() {
    let now = new Date().toLocaleString(); // current date
    // set the content of the element with the ID time to the formatted string
    document.getElementById('currentTime').innerHTML = now;
    // call this function again in 1000ms
    setInterval(this.updateClock, 1000);
  }

}
