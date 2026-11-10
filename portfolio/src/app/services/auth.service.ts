import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ServerService } from './server.service';
import { catchError, map, tap } from 'rxjs/operators';

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

  /** Login the @user. Emits true on success, false on failure, then completes. */
  login(user: User, returnUrl: string): Observable<boolean> {
    if (!user.username || !user.password) {
      return of(false);
    }
    return this.server.request('POST', '/login', {
      username: user.username,
      password: user.password
    }).pipe(
      map((response: any) => {
        if (!response?.token) return false;
        localStorage.setItem('authToken', response.token);
        this.loggedIn.next(true);
        this.router.navigateByUrl(this.safeReturnUrl(returnUrl));
        return true;
      }),
      catchError(() => of(false))
    );
  }

  /** Only allow in-app redirects after login (prevents open redirects). */
  private safeReturnUrl(returnUrl: string): string {
    return returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
      ? returnUrl
      : '/projects/sandbox/profile';
  }

  /** Refresh auth token */
  refreshAccessToken() {
    return this.server.request('POST', '/refresh', {})
      .pipe(
        tap((response : any) => {
          localStorage.setItem('authToken', response.accessToken);
        }),
        map(response => response.accessToken)
      );
  }

  /** Logout the user */
  logout() {
    this.loggedIn.next(false);
    localStorage.clear();
    sessionStorage.clear();
    this.server.request('POST', '/logout').subscribe({ error: () => {} });
    this.router.navigateByUrl('/projects/sandbox/login');
  }
}
