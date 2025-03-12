import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss'],
  standalone: false
})
export class SandboxComponent implements AfterViewInit {

  public projects: any[] = [
    {
      "routerLink": "./cssgrid",
      "pathImg": "../assets/images/angular.png",
      "description": "CSS Grid"
    },
    {
      "routerLink": "./login",
      "pathImg": "../assets/images/angular.png",
      "description": "Angular Login"
    },
    {
      "routerLink": "./pokemon",
      "pathImg": "../assets/images/angular.png",
      "description": "Pokemon"
    },
    {
      "routerLink": "./data-visualizations",
      "pathImg": "../assets/images/javascript.png",
      "description": "Data Visualizations",
      "desktopOnly": true
    }
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

}
