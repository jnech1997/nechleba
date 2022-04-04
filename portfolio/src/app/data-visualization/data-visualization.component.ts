import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.scss']
})
export class DataVisualizationComponent implements OnInit {

  public graphToLoad : string;

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
  }
}