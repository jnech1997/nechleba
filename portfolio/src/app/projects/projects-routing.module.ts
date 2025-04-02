import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CssGridComponent } from './css-grid/css-grid.component';
import { LoginComponent } from './login/login.component';
import { PokemonComponent } from './pokemon/pokemon.component';
import { ProfileComponent } from './profile/profile.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { ProjectsComponent } from './projects.component';
import { MandelbrotComponent } from './mandelbrot/mandelbrot.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent, data: {breadcrumb: 'Projects'}, children: [
    {path: 'mandelbrot', component: MandelbrotComponent, data: {breadcrumb: 'Mandelbrot'}},
    {path: 'sandbox', component: SandboxComponent, data: {breadcrumb: 'Sandbox'}, children: [
      { path: 'cssgrid', component: CssGridComponent, data: {breadcrumb: 'CSS Grid'}},
      { path: 'pokemon', component: PokemonComponent, data: {breadcrumb: 'Pokemon'}},
      { path: 'register', component: LoginComponent, data: {register: true, breadcrumb: 'Register'}},
      { path: 'login', component: LoginComponent, data: {register: false, breadcrumb: 'Login'}},
      { path: 'profile', component: ProfileComponent, data: {breadcrumb: 'Profile'}}
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
