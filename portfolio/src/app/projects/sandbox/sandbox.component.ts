import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss'],
  standalone: false
})
export class SandboxComponent implements AfterViewInit {

  public projects: any[] = [
    // {
    //   "routerLink": "./cssgrid",
    //   "pathImg": "../assets/images/angular.png",
    //   "description": "CSS Grid"
    // },
    {
      "routerLink": "./signup",
      "pathImg": "../assets/images/nodeJS.png",
      "description": "Node Login"
    },
    {
      "routerLink": "./pokemonteam/new",
      "pathImg": "../assets/images/angular.png",
      "description": "Pokemon Team Builder"
    }
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

}
