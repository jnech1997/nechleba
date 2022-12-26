import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = true;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  /** On load of the home screen, set loading tracker to false */
  onLoad() {
    this.loading = false;
  }

}
