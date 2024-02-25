import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map } from 'rxjs';

import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Clinic } from 'src/app/models/clinic.model';
import { ClinicAvailableToMakeAnAppointment } from '../interfaces/clinic-available.interface';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  public headers: {} = this.authService.headers;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  allClinics(from: number) {
    return this.http.get(`${environment.THECLINIC_API_URL}/clinics?pagination=${from}`, this.headers).pipe(
      delay(200),
      map(
        (resp: any) => {
          const clinics = resp.clinics.map(
            ({ clinic_id, register_number, name, phone, province, city, street, register_by, validationState, hasAssignments, photo }: Clinic) =>
              new Clinic(clinic_id, register_number, name, phone, province, city, street, register_by, validationState, hasAssignments, photo)
          );
          return {
            total: resp.total,
            clinics
          }
        })
    )
  }
  allClinicsAvailableToMakeAnAppointment() {
    return this.http.get(`${environment.THECLINIC_API_URL}/appointments/clinic-available`, this.headers).pipe(
      delay(200),
      map(
        (resp: any) => {
          const clinics = resp.clinics.map(
            ({ clinic_id, register_number, name, province, city }: ClinicAvailableToMakeAnAppointment) =>
              ({ clinic_id, register_number, name, province, city })
          );
          return {
            clinics
          }
        })
    )
  }

  createClinic(clinic: any) {
    return this.http.post(`${environment.THECLINIC_API_URL}/clinics`, clinic, this.headers)
  }

  updateClinic(clinic: any, clinic_id: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/clinics/${clinic_id}`, clinic, this.headers)
  }

  changeClinicStatus(clinic_to_change: string, user_logged: string) {
    return this.http.put(`${environment.THECLINIC_API_URL}/clinics/delete/${clinic_to_change}`, { user_logged }, this.headers)
  }
}
