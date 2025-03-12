import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-visualizations',
  templateUrl: './data-visualizations.component.html',
  styleUrls: ['./data-visualizations.component.scss'],
  standalone: false
})
export class DataVisualizationsComponent implements OnInit {

  public projects: any[] = [
    {
      "routerLink": "Global-Carbon",
      "pathImg": "/assets/images/javascript.png",
      "description": "Global Carbon",
      "alt": "javascript",
      "state": {
        title: "Carbon Dioxide in the Earth's Atmosphere",
        subtitle: "4/20/2020",
        description: "Taking data from the Global Monitoring Laboratory: https://gml.noaa.gov/ccgg/trends/data.html, we can see that the levels\
        in parts per million of carbon dioxide in the atmosphere has steadily increased in the past several decades. Due to the\
        Greenhouse Effect, this is likely to create a rise in the temperature of the Earth over time as many scientists have already warned."
      }
    }
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToGraph(graph : string) {
    this.router.navigate(["/sandbox/data-visualiations", graph]);
  }

}
