import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { PatientMedicalRecordService } from 'src/app/services/patient-medical-record.service';
import { MedicalRecord } from 'src/app/models/medical_record.model';

import { success, error } from 'src/app/helpers/sweetAlert.helper';

@Component({
  selector: 'app-edit-medical-record',
  templateUrl: './edit-medical-record.component.html',
  styles: [
  ]
})
export class EditMedicalRecordComponent {
  public medicalRecord!: MedicalRecord;
  public medicalRecordForm!: FormGroup;
  public isReadOny!: boolean

  constructor(
    private formBuilder: FormBuilder,
    private medicalRecordService: PatientMedicalRecordService,
    private store: Store<AppState>,
    public matDialogRef: MatDialogRef<EditMedicalRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.getASingeMedicalRecord();
    this.isReadOny = this.data.isReadOnly;

    this.medicalRecordForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      body: [null, [Validators.required]]
    });
    if (this.isReadOny) {
      this.medicalRecordForm.get('title')?.disable();
    }
  }

  get title() { return this.medicalRecordForm.get('title'); }
  get body() { return this.medicalRecordForm.get('body'); }

  get isFormValid() { return this.medicalRecordForm }
  get record(){ return this.medicalRecord }

  getASingeMedicalRecord() {
    this.medicalRecordService.getASingleMedicalRecord(this.data.id).subscribe(
      (resp: any) => {
        if (resp.ok) { 
          this.medicalRecord = resp.record;
          this.medicalRecordForm.patchValue({ 'title': resp.record.title });
          this.medicalRecordForm.patchValue({ 'body': resp.record.body });
        }
      },
      (err:any)=>{error(err.error.message)}
    )
  }

  editMedicalRecord(){
    if (!this.medicalRecordForm.invalid) {
      const edit_record = {  
        title: this.title?.value,
        body: this.body?.value,
        edited_by: this.data.doctor,
        last_edited_date: new Date()
      }

      this.medicalRecordService.editMedicalRecord(this.medicalRecord.id, edit_record)
        .subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.medicalRecordForm.reset()
              success(resp.message);
              this.matDialogRef.close();
              this.store.dispatch(ui.isLoadingTable());
            }
          },
          (err:any)=>{ error(err.error.message) }
      )
    }
  }
}
