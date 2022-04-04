import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CssGridComponent } from './css-grid/css-grid.component';
import { FormComponent } from './form/form.component';
import { PokemonComponent } from './pokemon/pokemon.component';
import { SandboxComponent } from './sandbox.component';

const routes: Routes = [
  { path: '', component: SandboxComponent },
  { path: 'cssgrid', component: CssGridComponent},
  { path: 'pokemon', component: PokemonComponent},
  { path: 'form', component: FormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRoutingModule { }
