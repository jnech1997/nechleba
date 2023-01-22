import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {

  public projects: any[] = [
    {
      "routerLink": "/sandbox/cssgrid",
      "pathImg": "../assets/images/angular.png",
      "description": "CSS Grid"
    },
    {
      "routerLink": "/sandbox/login",
      "pathImg": "../assets/images/angular.png",
      "description": "Angular Login"
    },
    {
      "routerLink": "/sandbox/pokemon",
      "pathImg": "../assets/images/angular.png",
      "description": "Pokemon"
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
