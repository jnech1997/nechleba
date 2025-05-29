import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

// routes for about and projects
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects',
    loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    useHash: true, 
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 0]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

