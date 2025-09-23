import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServerService } from './server.service';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  /** Return the current login state */
  get isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
  
  constructor(private router: Router, private server: ServerService) { 
    // on reload of page, if user in memory, log in
    const token = localStorage.getItem('authToken');
    if (token) {
      this.loggedIn.next(true);
    }
  }

  /** Login the @user */
  login(user: User, returnUrl: string) {
    if (user.username !== '' && user.password !== '') {
      // make the login request wrapped in an observable so outside
      // components that call the service can know whether the login was successfull
      return new Observable(subscriber => {
        this.server.request('POST', '/login', {
          username: user.username,
          password: user.password
        }).subscribe((response: any) => {
          if (response.token !== undefined) {
            localStorage.setItem('authToken', response.token);
            this.loggedIn.next(true);
            subscriber.next(true);
            this.router.navigateByUrl(returnUrl ? returnUrl : '/projects/sandbox/profile');
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
    this.loggedIn.next(false);
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl('/projects/sandbox/login');
  }
}
