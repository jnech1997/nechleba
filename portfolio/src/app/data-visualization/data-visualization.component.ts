import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.scss']
})
export class DataVisualizationComponent implements OnInit {

  public graphToLoad : string;
  public state$: Observable<any>;
  public title: string;
  public subtitle: string;
  public description: string;

  constructor(private route: ActivatedRoute) { 
   
  }

  ngOnInit(): void {
    // load graph for this route with d3 js integrated
    this.route.params.subscribe((params: Params) => {
      this.graphToLoad = params['graph'];
      const filePath = 'assets/visuals/' + (this.graphToLoad + '.js');
      let scriptGraph = document.createElement("script");
      scriptGraph.setAttribute("src", filePath);
      document.getElementById("graphContainer").appendChild(scriptGraph); 
    });
    if (!!sessionStorage['graph-title']) {
      this.title = sessionStorage['graph-title'];
      this.subtitle = sessionStorage['graph-subtitle'];
      this.description = sessionStorage['graph-description'];
    }
    this.state$ = this.route.paramMap.pipe(map(() => window.history.state));
    this.state$.subscribe((response) => {
      if (!!window.history.state.title) {
        this.title = window.history.state.title;
        this.subtitle = window.history.state.subtitle;
        this.description = window.history.state.description;
        sessionStorage.setItem('graph-title', window.history.state.title);
        sessionStorage.setItem('graph-subtitle', window.history.state.subtitle);
        sessionStorage.setItem('graph-description', window.history.state.description);
      }
  });
  }
}