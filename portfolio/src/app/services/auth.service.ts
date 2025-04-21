import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private token: string;

  /** Return the current login state */
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, private server: ServerService) { 
    // on reload of page, if user in memory, log in
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.token = user.token;
      this.server.setLoggedIn(true, this.token);
      this.loggedIn.next(true);
    }
  }

  /** Login the @user */
  login(user) {
    if (user.username !== '' && user.password !== '') {
      // make the login request wrapped in an observable so outside
      // components that call the service can know whether the login was successfull
      return new Observable(subscriber => {
        this.server.request('POST', '/login', {
          username: user.username,
          password: user.password
        }).subscribe((response: any) => {
          if (response.token !== undefined) {
            this.token = response.token;
            this.server.setLoggedIn(true, this.token);
            this.loggedIn.next(true);
            const userData = {
              token: this.token
            };
            localStorage.setItem('user', JSON.stringify(userData));
            subscriber.next(true);
            this.router.navigateByUrl('/sandbox/profile');
          }
        }, (error: any) => {
            subscriber.next(false);
            subscriber.complete();
        });
      });
    }
  }

  /** Logout the user */
  logout() {
    this.server.setLoggedIn(false);
    delete this.token;
    this.loggedIn.next(false);
    localStorage.clear();
    this.router.navigate(['/sandbox/login']);
  }
}
