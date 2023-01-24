import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CssGridComponent } from './css-grid/css-grid.component';
import { DataVisualizationComponent } from '../data-visualization/data-visualization.component';
import { DataVisualizationsComponent } from './data-visualizations/data-visualizations.component';
import { LoginComponent } from './login/login.component';
import { PokemonComponent } from './pokemon/pokemon.component';
import { ProfileComponent } from './profile/profile.component';
import { SandboxComponent } from './sandbox.component';

const routes: Routes = [
  { path: '', component: SandboxComponent, data: {breadcrumb: 'Sandbox'}, children: [
    { path: 'cssgrid', component: CssGridComponent, data: {breadcrumb: 'CSS Grid'}},
    { path: 'pokemon', component: PokemonComponent, data: {breadcrumb: 'Pokemon'}},
    { path: 'register', component: LoginComponent, data: {register: true, breadcrumb: 'Register'}},
    { path: 'login', component: LoginComponent, data: {register: false, breadcrumb: 'Login'}},
    { path: 'profile', component: ProfileComponent, data: {breadcrumb: 'Profile'}},
    { path: 'data-visualizations', component: DataVisualizationsComponent, data: {breadcrumb: 'Data Visualizations'}, children: [
      { path: ':graph', component: DataVisualizationComponent, data: { breadcrumb: 'id'}}
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRoutingModule { }
