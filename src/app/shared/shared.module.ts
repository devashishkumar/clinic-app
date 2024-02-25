import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from 'src/app/angular-material.module'; 
import { RouterModule } from '@angular/router';

//* Components
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SetterThemeComponent } from './setter-theme/setter-theme.component';


@NgModule({
  declarations: [
    BreadcrumbsComponent,
    SetterThemeComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    RouterModule
  ],
  exports: [
    BreadcrumbsComponent,
    SetterThemeComponent,
  ]
})
export class SharedModule { }
