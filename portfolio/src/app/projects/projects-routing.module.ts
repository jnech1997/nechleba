import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CssGridComponent } from './css-grid/css-grid.component';
import { LoginComponent } from './login/login.component';
import { PokemonTeamBuilderComponent } from './pokemon/pokemon-team-builder.component';
import { ProfileComponent } from './profile/profile.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { ProjectsComponent } from './projects.component';
import { MandelbrotComponent } from './mandelbrot/mandelbrot.component';
import { PokemonTeamListComponent } from './pokemon/pokemon-team-list/pokemon-team-list.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  { path: '', component: ProjectsComponent, data: {breadcrumb: 'Projects'}, children: [
    {path: 'mandelbrot', component: MandelbrotComponent, data: {breadcrumb: 'Mandelbrot'}},
    {path: 'sandbox', component: SandboxComponent, data: {breadcrumb: 'Sandbox'}, children: [
      { path: 'cssgrid', component: CssGridComponent, data: {breadcrumb: 'CSS Grid'}},
      { path: 'pokemonteam', component: PokemonTeamListComponent, canActivate: [AuthGuard], data: {
        breadcrumb: 'Pokemon Teams'
      }},
      { path: 'pokemonteam/new', component: PokemonTeamBuilderComponent, data: {
        breadcrumb: 'Pokemon Builder'
      }},
      { path: 'pokemonteam/:id/edit', component: PokemonTeamBuilderComponent, canActivate: [AuthGuard], data: {
        breadcrumb: 'Pokemon Builder'
      }},
      { path: 'signup', component: LoginComponent, data: {signup: true, breadcrumb: 'Sign Up'}},
      { path: 'login', component: LoginComponent, data: {signup: false, breadcrumb: 'Login'}},
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: {breadcrumb: 'Profile'}}
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
