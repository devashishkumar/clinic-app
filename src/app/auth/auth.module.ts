import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http'
import { NgModule } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { LoginComponent } from './login/login.component';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { Error403Component } from './error403/error403.component';




@NgModule({
  declarations: [
    Error403Component,
    LoginComponent,
    PatientRegisterComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    Error403Component,
    LoginComponent,
  ],
  providers:[provideNgxMask()]
  
})
export class AuthModule { }
