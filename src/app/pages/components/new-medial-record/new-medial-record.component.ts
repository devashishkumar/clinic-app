import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { PatientMedicalRecordService } from 'src/app/services/patient-medical-record.service';

import { success, error } from 'src/app/helpers/sweetAlert.helper';

@Component({
  selector: 'app-new-medial-record',
  templateUrl: './new-medial-record.component.html',
  styles: [
  ]
})
export class NewMedialRecordComponent {
  public medicalRecordForm!: FormGroup;
  public isEditable!: boolean

  ngOnInit() {
    this.medicalRecordForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]]
    })
  }

  constructor(
    private formBuilder: FormBuilder,
    private medicalRecord: PatientMedicalRecordService,
    private store: Store<AppState>,
    public matDialogRef: MatDialogRef<NewMedialRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  get title() { return this.medicalRecordForm.get('title') }
  get body() { return this.medicalRecordForm.get('body') }
  get isFormValid() { return this.medicalRecordForm.invalid }

  newRecordForPatient() {
    if (!this.medicalRecordForm.invalid) {
      const new_record = {
        doctor: this.data.doctor,
        patient: this.data.id,
        document_number: this.data.document_number,
        date: new Date(),
        title: this.title?.value,
        body: this.body?.value
      }

      this.medicalRecord.createMedicalRecord(new_record)
        .subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.medicalRecordForm.reset();
              success(resp.message);
              this.matDialogRef.close();
              this.store.dispatch(ui.isLoadingTable());
            }
          },
          (err: any) => { error(err.error.message) }
        )
    }
  }
}
