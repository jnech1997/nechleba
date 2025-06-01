import { AfterViewInit, Component, ChangeDetectorRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: false
})
export class ProjectsComponent implements AfterViewInit, OnInit {

  public loading = false;

  public projects: any[] = [
    {
      "routerLink": "./mandelbrot",
      "pathImg": "../assets/images/javascript.png",
      "description": "Mandelbrot Set"
    },
    {
      "routerLink": "./sandbox/signup",
      "pathImg": "../assets/images/nodeJS.png",
      "description": "Node Login"
    },
    {
      "href": "https://jnech1997.github.io/projects/starsCanvas/index.html",
      "pathImg": "../assets/images/javascript.png",
      "description": "Star Canvas Animation"
    },
    {
      "href": "https://trattoriapelliccia.it",
      "pathImg": "../assets/images/angular.png",
      "description": "Trattoria Pelliccia"
    },
    {
      "href": "https://jnech1997.github.io/projects/d3GraphVisualization/index.html",
      "pathImg": "../assets/images/javascript.png",
      "description": "BFS vs DFS"
    },
    {
      "href": "https://github.com/jnech1997/matrix",
      "pathImg": "../assets/images/java.png",
      "description": "Matrix Calculator"
    },
    {
      "href": "https://jnech1997.github.io/projects/jellyHopWeb/index.html",
      "pathImg": "../assets/images/jelly.png",
      "description": "Jelly Hop Platformer"
    },
    {
      "href": "https://github.com/jnech1997/Othello",
      "pathImg": "../assets/images/ocaml.jpg",
      "description": "Othello in OCaml"
    },
    {
      "routerLink": "./sandbox",
      "pathImg": "../assets/images/angular.png",
      "description": "Sandbox"
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit() : void {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }
}
