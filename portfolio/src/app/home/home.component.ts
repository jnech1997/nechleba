import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit, AfterViewInit {

  loading = true;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  /** On load of the entire page, set loading tracker to false */
  ngAfterViewInit() : void {
    this.loading = false;
  }
}
