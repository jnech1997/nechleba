import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CssGridComponent } from './css-grid/css-grid.component';
import { LoginComponent } from './login/login.component';
import { PokemonComponent } from './pokemon/pokemon.component';
import { ProfileComponent } from './profile/profile.component';
import { SandboxComponent } from './sandbox.component';

const routes: Routes = [
  { path: '', component: SandboxComponent },
  { path: 'cssgrid', component: CssGridComponent},
  { path: 'pokemon', component: PokemonComponent},
  { path: 'register', component: LoginComponent, data: {register: true}},
  { path: 'login', component: LoginComponent, data: {register: false}},
  { path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRoutingModule { }
