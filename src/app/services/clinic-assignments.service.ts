import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DoctorAvailable } from '../interfaces/doctors-available.interface';
import { DoctorAssigned } from '../interfaces/doctor_assigment.inteface';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicAssignmentsService {
  public headers: {} = this.authService.headers;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  allEmployeesAssingedToClinic(clinic: string, from: number) {
    return this.http.get(`${environment.THECLINIC_API_URL}/clinic-assignments/all-assigned?clinic=${clinic}&pagination=${from}`, this.headers)
      .pipe(delay(200));
  }
  
  allEmployeesAvaibleToBeAssigned() {
    return this.http.get(`${environment.THECLINIC_API_URL}/clinic-assignments/all-available`, this.headers).pipe(
      delay(200),
      map((resp: any) => {
        const doctors_available = resp.doctors_available.map(
          ({ id, document_type, document_number, email, name,
            lastname, gender, phone, validationState, email_name, email_provider, rol, photo }: User) =>
            new User(id, document_type, document_number, email, name,
              lastname, gender, phone, validationState, email_name, email_provider, rol, photo)
        );
        return {
          doctors_available
        }
      })
    );
  }

  allDoctorsAvailableToMakeAnAppointment(clinic: string) {
    return this.http.get(`${environment.THECLINIC_API_URL}/clinic-assignments/doctors-available/${clinic}`, this.headers).pipe(
      delay(200),
      map((resp: any) => {
        const doctors = resp.doctors.map(
          ({ id, name, lastname, photo }: DoctorAvailable) =>
            ({ id, name, lastname, photo})
        );
        return { doctors }
      }));
  }

  assignDoctorsToClinic(clinic_id: string, doctors_assigned: string[]) {

    return this.http.post(`${environment.THECLINIC_API_URL}/clinic-assignments/${clinic_id}`, { doctors_assigned }, this.headers)
  }


  removeAllDoctorsAssignedToClinic(clinic_id: string) {

    return this.http.delete(`${environment.THECLINIC_API_URL}/clinic-assignments/remove-all/${clinic_id}`, this.headers)
  }

  removeADoctorAssignedToClinic(reference: string, clinic_id: string, doctor_id: string) {
    return this.http.delete(`${environment.THECLINIC_API_URL}/clinic-assignments/remove-one/${reference}?clinic=${clinic_id}&doctor=${doctor_id}`, this.headers)
  }
}
