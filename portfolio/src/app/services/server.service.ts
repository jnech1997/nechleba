import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

const baseUrl = 'https://www.josephnechleba.com/api';

// Service that communicates with the node server

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private loggedIn = false;
  private token: string;

  constructor(private http: HttpClient) {}

  /** Set the state of login as logged in */
  setLoggedIn(loggedIn: boolean, token?: string) {
    this.loggedIn = loggedIn;
    this.token = token;
  }

  /** Determine whether the request is a GET or POST and execute appropriately */
  request(method: string, route: string, data?: any) {
    if (method === 'GET') {
      return this.get(route, data);
    }

    const header = (this.loggedIn) ? { Authorization: `Bearer ${this.token}` } : undefined;
    
    return this.http.request(method, baseUrl + route, {
      body: data,
      responseType: 'json',
      observe: 'body',
      headers: header
    });
  }

  /** Do a GET request on this @route with the @data */
  get(route: string, data?: any) {
    // attach the token to the header
    const header = (this.loggedIn) ? { Authorization: `Bearer ${this.token}` } : undefined;
    let params = new HttpParams();
    if (data !== undefined) {
      Object.getOwnPropertyNames(data).forEach(key => {
        params = params.set(key, data[key]);
      });
    }

    return this.http.get(baseUrl + route, {
      responseType: 'json',
      headers: header,
      params
    });
  }
}
