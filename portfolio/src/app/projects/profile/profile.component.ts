import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {

  firstName: string;
  lastName: string;
  username: string;

  constructor(
    private server: ServerService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.server.request('GET', '/profile').subscribe((user: any) => {
      if (user) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
      }
    });
  }
}
