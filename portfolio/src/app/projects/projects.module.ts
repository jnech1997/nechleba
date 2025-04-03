import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { SandboxComponent } from './sandbox/sandbox.component';
import { CssGridComponent } from './css-grid/css-grid.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule as MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule as MatInputModule } from '@angular/material/input';
import { MatCardModule as MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { PokemonComponent } from './pokemon/pokemon.component';
import { ProfileComponent } from './profile/profile.component';
import { DataVisualizationsComponent } from './data-visualizations/data-visualizations.component';
import { DataVisualizationComponent } from './data-visualization/data-visualization.component';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { ProjectsComponent } from './projects.component';
import { MandelbrotComponent } from './mandelbrot/mandelbrot.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [
    SandboxComponent,
    CssGridComponent,
    LoginComponent,
    PokemonComponent,
    ProfileComponent,
    DataVisualizationsComponent,
    DataVisualizationComponent,
    ProjectsComponent,
    MandelbrotComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjectsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    BreadcrumbModule,
    MatSidenavModule,
    DragDropModule,
    MatDividerModule
  ],
  exports: [
    ProjectsComponent
  ]
})
export class ProjectsModule { }