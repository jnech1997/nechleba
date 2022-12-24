import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { HomeComponent } from './home/home.component';
import { DataVisualizationsComponent } from './data-visualizations/data-visualizations.component';
import { DataVisualizationComponent } from './data-visualization/data-visualization.component';

// routes for about and projects
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'projects', component: ProjectsComponent }, 
  { 
    path: 'data-visualizations', 
    component: DataVisualizationsComponent,
  },
  {
    path: 'data-visualiations/:graph',
    component: DataVisualizationComponent
  },
  { path: 'sandbox', loadChildren: () => import('./sandbox/sandbox.module').then(m => m.SandboxModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
