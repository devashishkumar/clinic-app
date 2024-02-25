import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { delay, map } from 'rxjs';

import { AuthService } from './auth.service';

import { environment } from 'src/environments/environment';
import { Patient } from 'src/app/models/patient.model';
import { UserRegisterForm } from 'src/app/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  public headers: {} = this.authService.headers;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  allPatients(from: number) {
    return this.http.get(`${environment.THECLINIC_API_URL}/patients?pagination=${from}`, this.headers).pipe(
      delay(200),
      map((resp: any) => {
        const patients = resp.patients.map(
          ({ id, document_type, document_number, email, name,
            lastname, gender, phone, validationState, email_name, email_provider, rol, photo }: Patient) =>
            new Patient(id, document_type, document_number, email, name,
              lastname, gender, phone, validationState, email_name, email_provider, rol, photo)
        );
        return {
          total: resp.total,
          patients
        }
      })
    );
  }

  getSinglePatient(document_number: string) {
    return this.http.get(`${environment.THECLINIC_API_URL}/patients/${document_number}`, this.headers);
  }

  crearteNewPatientWithEmailAndPassword(patient: UserRegisterForm) {
    return this.http.post(`${environment.THECLINIC_API_URL}/patients`, patient, this.headers);
  }

  crearteNewPatientWithEmailAndPasswordOutside(patient: UserRegisterForm) {
    return this.http.post(`${environment.THECLINIC_API_URL}/patients/outside`, patient);
  }

  updatePatient(patient: any, id: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/patients/${id}`, patient, this.headers);
  }

  changePatientStatus(patient_to_change: string, user_logged: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/patients/delete/${patient_to_change}`, { user_logged }, this.headers);
  }

  confirmateOldPassword(patient: string, oldPassword: string) {
    return this.http.post(`${environment.THECLINIC_API_URL}/patients/confirm-password/${patient}`, { oldPassword }, this.headers);
  }

  changePassword(patient: string, newPassword: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/patients/change-password/${patient}`, { newPassword }, this.headers);
  }
}
