import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-visualizations',
  templateUrl: './data-visualizations.component.html',
  styleUrls: ['./data-visualizations.component.scss']
})
export class DataVisualizationsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToGraph(graph : string) {
    this.router.navigate(["data-visualiations", graph]);
  }

}
