import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

const baseUrl = 'https://www.josephnechleba.com/api';

// Service that communicates with the node server

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) {}

  /** Determine whether the request is a GET or POST and execute appropriately */
  request(method: string, route: string, data?: any) {
    if (method === 'GET') {
      return this.get(route, data);
    }
    
    return this.http.request(method, baseUrl + route, {
      body: data,
      responseType: 'json',
      observe: 'body'
    });
  }

  /** Do a GET request on this @route with the @data */
  get(route: string, data?: any) {
    let params = new HttpParams();
    if (data !== undefined) {
      Object.getOwnPropertyNames(data).forEach(key => {
        params = params.set(key, data[key]);
      });
    }

    return this.http.get(baseUrl + route, {
      responseType: 'json',
      params
    });
  }
}
