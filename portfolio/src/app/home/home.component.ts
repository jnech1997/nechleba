import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {

  loading = true;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  /** On load of the home screen image, set loading tracker to false */
  onLoad() : void {
    this.loading = false
  }
}
