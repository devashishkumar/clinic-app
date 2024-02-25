import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizeUserGuard } from '../guards/authorize-user.guard';

import { Rol } from '../interfaces/authorized-roles.enum';

//* Components
import { ClinicsComponent } from './clinics/clinics.component';
import { AppointmentComponent } from './appointments/appointments.component';
import { Error404Component } from './error404/error404.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { PatientsComponent } from './patients/patients.component';
import { ShowClinicComponent } from './show-clinic/show-clinic.component';
import { ShowUserComponent } from './show-user/show-user.component';
import { UsersComponent } from './users/users.component';

const childRoutes: Routes = [
  { path: 'calendar', component: AppointmentComponent, data: { title: 'Calendar'} },
  { path: 'medical-record', component: MedicalRecordComponent, canActivate: [AuthorizeUserGuard], data: { title: 'Medical Record',  allowedRoles: [Rol.ADMIN, Rol.PATIENT, Rol.DOCTOR] } },
  { path: 'show-user', component: ShowUserComponent, data: { title: 'User Profile' } },
  { path: 'show-clinic', component: ShowClinicComponent, data: { title: 'Clinic Profile'} },
  { path: 'patients', component: PatientsComponent, canActivate: [AuthorizeUserGuard], data: { title: 'Patients', allowedRoles: [Rol.ADMIN, Rol.OPERATOR] } },
  { path: 'clinics', component: ClinicsComponent, canActivate: [AuthorizeUserGuard], data: { title: 'Clinics', allowedRoles: [Rol.ADMIN]} },
  { path: 'users', component: UsersComponent, canActivate: [AuthorizeUserGuard], data: { title: 'Users', allowedRoles: [Rol.ADMIN] } },
  {path: '**', component: Error404Component}
]

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
  exports:[RouterModule]
})
export class ChildRoutesModule { }
