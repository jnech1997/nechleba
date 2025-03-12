import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'platform'
})
export class BreadcrumbService {
  
  // Subject emitting the breadcrumbs
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  // Observable exposing the breadcrumbs
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      // only register router events when the navigation is finished
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(event => {
      // Construct the breadcrumb hierarchy
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs: Breadcrumb[] = [];
      this.addBreadcrumb(root, [], breadcrumbs);
      // Emit the new hierarchy
      this._breadcrumbs$.next(breadcrumbs);
    });
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map(url => url.path));
      // Add an element for the current route part
      if (route.data.breadcrumb) {
        const breadcrumb = {
          label: this.getLabel(route.data, routeUrl),
          url: '/' + routeUrl.join('/')
        }
        breadcrumbs.push(breadcrumb);
      }
      // Recursively add another element for the next route part
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data, url: string[]) { 
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data 
    return data.breadcrumb === 'id' ? url[url.length - 1] : data.breadcrumb; 
  } 
}
