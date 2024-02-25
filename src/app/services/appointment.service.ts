import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay, map } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';
import { Appointment } from 'src/app/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  public headers: {} = this.authService.headers
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllAppointments() {
    return this.http.get(`${environment.THECLINIC_API_URL}/appointments`, this.headers).pipe(
      delay(200),
      map((resp: any) => {
        const appointments = resp.appointments.map(
          ({ appointment_id, start, end, title, clinic, clinic_info, doctor, doctor_info, patient, createdby }: Appointment) =>
            new Appointment(appointment_id, new Date(start), new Date(end), title, clinic, clinic_info, doctor, doctor_info, patient, createdby)
        );
        return {
          total: resp.total,
          appointments
        }
      })
    );
  }
  createNewAppointment(appointment: any) {
    return this.http.post(`${environment.THECLINIC_API_URL}/appointments`, appointment, this.headers);
  }

  editAppointment(id: string, appointment: any) {
    return this.http.put(`${environment.THECLINIC_API_URL}/appointments/${id}`, appointment, this.headers);
  }

  deleteAppointment(id: string, userLogged: string) {
    return this.http.delete(`${environment.THECLINIC_API_URL}/appointments/${id}?user=${userLogged}`, this.headers);
  }

}
