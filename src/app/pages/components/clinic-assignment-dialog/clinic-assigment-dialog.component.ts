import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { ClinicService } from 'src/app/services/clinic.service';
import { UpdateProfileService } from 'src/app/services/update-profile.service';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { ClinicAssignmentsService } from 'src/app/services/clinic-assignments.service';

@Component({
  selector: 'app-clinic-assignment-dialog',
  templateUrl: './clinic-assignment-dialog.component.html',
  styles: [
  ],
  providers: [
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check'} as MatCheckboxDefaultOptions}
  ]
})
export class ClinicAssignmentDialogComponent {
  public assignmentForm!: FormGroup;
  public assignmentList!: FormArray<any>;
  public thereIsSomebodyToAssing: number = 0;
  public employeeStaff: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private clinicService: ClinicService,
    private clinicAssignment: ClinicAssignmentsService,
    private updateProfile: UpdateProfileService,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<ClinicAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
  ngOnInit(): void {
    this.employeeStaff = this.data.doctors
    this.assignmentForm = this.formBuilder.group({
      selectedStaff: this.formBuilder.array([])
    });
  }
  addToAssignmentList(event: any) {
   
    this.assignmentList = (this.assignmentForm.controls['selectedStaff'] as FormArray);
    if (event.checked) {
      this.assignmentList.push(new FormControl(event.source.value));
    } else {
      const index = this.assignmentList.controls
      .findIndex( (staff:any) => staff.value === event.source.value);
      this.assignmentList.removeAt(index);
    }
    this.thereIsSomebodyToAssing = this.assignmentList.length
  }
  saveAssignment() {
    this.clinicAssignment.assignDoctorsToClinic(this.data.clinic, this.assignmentForm.value).subscribe(
    (resp: any) => { 
        if (resp.ok) {
        this.updateProfile.clinicToUpdate(resp.clinic);
        success(resp.message);
        this.store.dispatch(ui.isLoadingTable());
      }
    }, (err: any) => {
      error(err.error.message)
    }
    );
    this.dialogRef.close();
  }
}
