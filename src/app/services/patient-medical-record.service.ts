import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { MedicalRecord } from '../models/medical_record.model';

@Injectable({
  providedIn: 'root'
})
export class PatientMedicalRecordService {

  public headers: {} = this.authService.headers;
  public doctor: string = this.authService.currentUserLogged.id
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  createMedicalRecord(new_record: any) {
    return this.http.post(`${environment.THECLINIC_API_URL}/patient-records`, new_record, this.headers);
  }
  getAllMedicalRecordsByPatient(document_number: string, pagination: number) {
    return this.http.get(`${environment.THECLINIC_API_URL}/patient-records?document_number=${document_number}&pagination=${pagination}`, this.headers).pipe(
      delay(200),
      map((resp: any) => {

        const records = resp.records.map(
          ({ id, date, title, body, doctor, patient, document_number }: MedicalRecord) =>
            new MedicalRecord(id, date, title, body, doctor, patient, document_number)
        );
        return {
          total: resp.total,
          records
        }
      })
    );
  }
  getASingleMedicalRecord(id: string) {
    return this.http.get(`${environment.THECLINIC_API_URL}/patient-records/record/${id}`, this.headers);
  }

  editMedicalRecord(id: string, edit_record: any) {
    return this.http.put(`${environment.THECLINIC_API_URL}/patient-records/${id}`, edit_record, this.headers);
  }
}
