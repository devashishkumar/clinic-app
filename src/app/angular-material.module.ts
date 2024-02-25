import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';  
import { MatSidenavModule } from '@angular/material/sidenav'; 
import {MatListModule} from '@angular/material/list';
//! PrimeNG
import { EditorModule } from 'primeng/editor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxMatTimepickerModule.setLocale('en-Us')
  ],
  exports: [
    DialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatStepperModule,
    MatTableModule,
    NgxMatTimepickerModule,
    MatSidenavModule,
    MatListModule,
    // ! PrimeNg
    EditorModule
  ]
})
export class AngularMaterialModule { }
