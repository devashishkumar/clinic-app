import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator'

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';


import { ClinicService } from 'src/app/services/clinic.service';
import { AuthService } from 'src/app/services/auth.service';
import { UpdateProfileService } from 'src/app/services/update-profile.service';

import { Clinic } from 'src/app/models/clinic.model';
import { User } from 'src/app/models/user.model';
import { Patient } from 'src/app/models/patient.model';

import { RegisterClinicComponent } from '../components/register-clinic/register-clinic.component';
import { success, error } from 'src/app/helpers/sweetAlert.helper';


@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styles: [
  ]
})
export class ClinicsComponent {

  public currentUserLogged!: User | Patient
  public uiSubscription!: Subscription;

  // ? table
  public clinicList: Clinic[] = [];
  public dataTemp: Clinic[] = [];
  
  //? angular material paginator 
  public from: number = 0;
  public hidePageSize: boolean = false;
  public length!:number;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public pageSize: number = 5;
  public pageSizeOptions: number[] = [5, 10, 25];
  public showPageSizeOptions: boolean = true;
  
 
  
  constructor(
    private authService: AuthService,
    private clinicService: ClinicService,
    private store: Store<AppState>,
    public updateProfileService: UpdateProfileService,
    public matDialog: MatDialog,
    public matconfig: MatPaginatorIntl
  ) { }

  ngOnInit(): void {
    this.matconfig.previousPageLabel = '';
    this.matconfig.nextPageLabel = '';
    this.matconfig.itemsPerPageLabel = 'Clinics per page';
    this.currentUserLogged = this.authService.currentUserLogged;
    this.allClinics();
    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {
        this.allClinics();
        this.store.dispatch(ui.isLoadingTable());
      }
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }
  
  openDialog(): void {
    this.matDialog.open(RegisterClinicComponent, {
      width: '100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  } 


  allClinics() {
    this.clinicService.allClinics(this.from)
    .subscribe(
      ({ clinics, total }) => {
        this.clinicList = clinics;
        this.dataTemp = clinics;
        this.length = total;
      }
    );
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageIndex = e.pageIndex;
    
    if (this.pageEvent.pageIndex > this.pageEvent.previousPageIndex!) {
      this.from = this.from + this.pageSize;
    } else { 
      this.from = this.from - this.pageSize;
    }
    this.allClinics();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  changeClinicState(clinic_to_change: string, user_logged: string ) {
    this.clinicService.changeClinicStatus(clinic_to_change, user_logged).subscribe((resp: any)=> { 
      if (resp.ok) {
        success(resp.message);
        this.allClinics();
      }
    }, (err)=>{error(err.error.message)});
  }

  
}
