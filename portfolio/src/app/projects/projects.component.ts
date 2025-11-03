import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  OnInit,
} from "@angular/core";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  standalone: false,
})
export class ProjectsComponent implements AfterViewInit, OnInit {
  public loading = false;

  public projects: any[] = [
    {
      href: "https://moodboard-frontend-ten.vercel.app",
      pathImg: "../assets/images/favicon.png",
      description: "GPT Moodboard Generator",
    },
    {
      href: "https://trattoriapelliccia.it",
      pathImg: "../assets/images/angular.png",
      description: "Trattoria Pelliccia",
    },
    {
      routerLink: "./sandbox/pokemonteam/new",
      pathImg: "../assets/images/nodeJS.png",
      description: "Pokemon Team Builder",
    },
    {
      routerLink: "./mandelbrot",
      pathImg: "../assets/images/javascript.png",
      description: "Mandelbrot Set",
    },
    {
      href: "https://github.com/jnech1997/matrix",
      pathImg: "../assets/images/java.png",
      description: "Matrix Calculator",
    },
    {
      href: "https://github.com/jnech1997/Othello",
      pathImg: "../assets/images/ocaml.jpg",
      description: "Othello in OCaml",
    },
    {
      href: "https://jnech1997.github.io/projects/starsCanvas/index.html",
      pathImg: "../assets/images/javascript.png",
      description: "Star Canvas Animation",
    },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.cdr.detectChanges();
    });
  }
}
