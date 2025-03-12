import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbService } from './breadcrumb.service';
import { MatButtonModule as MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule
  ],
  providers: [
    BreadcrumbService
  ],
  exports: [
    BreadcrumbComponent
  ]
})
export class BreadcrumbModule {}
