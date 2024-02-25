import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';
import { PatientService } from 'src/app/services/patient.service';

import { AuthService } from 'src/app/services/auth.service';
import { UpdateProfileService } from 'src/app/services/update-profile.service';
import { UiService } from 'src/app/services/ui.service';

import { User } from 'src/app/models/user.model';
import { Patient } from 'src/app/models/patient.model';

import { UserRegisterComponent } from 'src/app/pages/components/user-register/user-register.component';
import { success, error } from 'src/app/helpers/sweetAlert.helper';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styles: [
  ]
})
export class PatientsComponent {
  public uiSubscription!: Subscription;
  public currentUserLogged!: User | Patient
  
  // ? Patient's table
  public patientList: Patient[] = [];
  public dataTemp: Patient[] = [];

  // ? Angular Material Paginator 

  public from: number = 0;
  public hidePageSize: boolean = false;
  public length!:number;
  public pageEvent!: PageEvent;
  public pageIndex:number = 0;
  public pageSize: number = 5;
  public pageSizeOptions: number[] = [5, 10, 25];
  public showPageSizeOptions: boolean = true;
  
  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private store: Store<AppState>,
    private ui: UiService,
    public matconfig: MatPaginatorIntl,
    public matDialog: MatDialog,
    public updateProfileService: UpdateProfileService  
  ) { }

  ngOnInit(): void {
    this.matconfig.previousPageLabel = '';
    this.matconfig.nextPageLabel = '';
    this.matconfig.itemsPerPageLabel = 'Patients per page';
    this.currentUserLogged = this.authService.currentUserLogged;
    this.allPatients();
    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {
        this.allPatients();
        this.store.dispatch(ui.isLoadingTable());
      }
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  openDialog(userType: string): void {
    this.ui.currentUserType(userType);
    this.matDialog.open(UserRegisterComponent, {
      width: '100%',
      maxHeight:'95vh',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  } 


  allPatients() {
    this.patientService.allPatients(this.from)
    .subscribe(
      ({ patients, total }) => {
        this.patientList = patients;
        this.dataTemp = patients;
        this.length = total;
      }
    );
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageIndex = e.pageIndex;
    
    if (this.pageEvent.pageIndex > this.pageEvent.previousPageIndex!) {
      this.from = this.from + this.pageSize
    } else { 
      this.from = this.from - this.pageSize
    }
    this.allPatients();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  changePatientState(patient_to_change: string, user_logged: string ) {
    this.patientService.changePatientStatus(patient_to_change, user_logged).subscribe((resp: any)=> { 
      if (resp.ok) {
        success(resp.message);
        this.allPatients();
      }
    }, (err)=>{error(err.error.message)});
  }
  
}
