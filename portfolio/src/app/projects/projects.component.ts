import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: false
})
export class ProjectsComponent {

  public projects: any[] = [
    {
      "href": "https://jnech1997.github.io/projects/d3GraphVisualization/index.html",
      "pathImg": "../assets/images/javascript.png",
      "description": "BFS vs DFS"
    },
    {
      "href": "https://www.youtube.com/watch?v=Lyq2RXXD3mE",
      "pathImg": "../assets/images/python.png",
      "description": "Duckie Detector"
    },
    {
      "href": "https://jnech1997.github.io/projects/jellyHopWeb/index.html",
      "pathImg": "../assets/images/jelly.png",
      "description": "Jelly Hop Platformer"
    },
    {
      "href": "https://github.com/jnech1997/SortingMethodsLinkedList",
      "pathImg": "../assets/images/java.png",
      "description": "Sorting Methods"
    },
    {
      "href": "https://jnech1997.github.io/projects/nameDraw/index.html",
      "pathImg": "../assets/images/javascript.png",
      "description": "SVG Name Draw"
    },
    {
      "href": "https://github.com/jnech1997/Othello",
      "pathImg": "../assets/images/ocaml.jpg",
      "description": "Othello in OCaml"
    },
    {
      "href": "https://github.com/jnech1997/matrix",
      "pathImg": "../assets/images/java.png",
      "description": "Matrix Calculator"
    },
    {
      "href": "https://github.com/jnech1997/HandPan",
      "pathImg": "../assets/images/java.png",
      "description": "Hand Pan Translation"
    },
    {
      "routerLink": "/sandbox",
      "pathImg": "../assets/images/angular.png",
      "description": "Sandbox"
    }
  ];

  constructor() { }
}
