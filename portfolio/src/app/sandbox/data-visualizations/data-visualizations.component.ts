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
    },
    {
      "routerLink": "Global-Warming",
      "pathImg": "/assets/images/javascript.png",
      "description": "Global Average Monthly",
      "alt": "javascript",
      "state": {
        title: "Is the Earth Getting Warmer?",
        subtitle: "5/11/2020",
        description: "This graph shows for a given country, how the maximum average-monthly temperature has changed\
        over time. You can see that for some very high temperature and very low temperature climates, for example Kuwait and Greenland, the max has had a trend of increase\
        in the last decades. However, as you can also see it is difficult to say whether climate change affects global temperature patterns uniformly on an average-monthly scale. In the\
        future I'd like to investigate a data set that provides a daily average for countries, which might give more granularity. This data was taken from https://www.kaggle.com/berkeleyearth/climate-change-earth-surface-temperature-data."
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
