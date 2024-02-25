import { Component } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator'

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import { UpdateProfileService } from 'src/app/services/update-profile.service';

import { Clinic } from 'src/app/models/clinic.model';
import { User } from 'src/app/models/user.model';
import { Patient } from 'src/app/models/patient.model';
import { Rol } from 'src/app/interfaces/authorized-roles.enum';

import { ClinicAssignmentDialogComponent } from '../clinic-assignment-dialog/clinic-assigment-dialog.component';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { ClinicAssignmentsService } from 'src/app/services/clinic-assignments.service';
import { DoctorAssigned } from 'src/app/interfaces/doctor_assigment.inteface';


@Component({
  selector: 'app-clinic-assignment',
  templateUrl: './clinic-assignment.component.html',
  styles: [
  ]
})
export class ClinicAssignmentComponent {
  public uiSubscription!: Subscription;
  
  public currentUserLogged!: User | Patient 
  public clinic_id!: string;
  public hasAssignments!: boolean;
  public profileSelected!: Clinic;
  public userRol!: Rol;

  // ? Doctors Availables to be assigned
  public doctorsAvailableList: User[] = [];

  // ? Doctors Availables to be assigned
  public doctorsAssignedList: DoctorAssigned[] = [];
  public dataTempAssigned: DoctorAssigned[] = [];

  // ? Angular Material Paginator
  public length!:number;
  public pageSize: number = 5;
  public from: number = 0;
  public pageIndex:number = 0;
  public pageSizeOptions: number[] = [5, 10, 25];
  public hidePageSize: boolean = false;
  public showPageSizeOptions: boolean = true;
  public pageEvent!: PageEvent;


  constructor(
    private clinicAssignment: ClinicAssignmentsService,
    private store: Store<AppState>,
    private authService: AuthService,
    private updateProfileService: UpdateProfileService,
    public matDialog: MatDialog,
    public mat: MatPaginatorIntl
  
  ) { }

  ngOnInit(): void {
    this.userRol = this.authService.userRol;
    this.clinic_id = this.updateProfileService.clinicProfile.clinic_id
    this.mat.previousPageLabel = '';
    this.mat.nextPageLabel = '';
    this.mat.itemsPerPageLabel = 'Doctors assigned per page';
    this.allEmployeesAvaibleToBeAssigned();
    this.allEmployeesAssignedToClinic();
    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {
        this.allEmployeesAvaibleToBeAssigned();
        this.allEmployeesAssignedToClinic();
        this.profileSelected = this.updateProfileService.clinicProfileToUpdate;
        this.hasAssignments = this.profileSelected.hasAssignments;
        this.store.dispatch(ui.isLoadingTable());
      }
    });
    this.doctorsAvailableList;
    this.hasAssignments = this.updateProfileService.clinicProfileToUpdate.hasAssignments;
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }
 
  allEmployeesAvaibleToBeAssigned() {
    this.clinicAssignment.allEmployeesAvaibleToBeAssigned()
      .subscribe(
        ({ doctors_available }) => {
          this.doctorsAvailableList = [ ...doctors_available ];
      });
    }
    
    allEmployeesAssignedToClinic() {
      console.log()
      this.clinicAssignment.allEmployeesAssingedToClinic(this.clinic_id, this.from)
      .subscribe(
        ({doctors_assigned, total}: any) => {
          this.doctorsAssignedList = doctors_assigned;
          this.dataTempAssigned = doctors_assigned;
          this.length = total;
        }
      )
    }
    
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageIndex=e.pageIndex
    
    if (this.pageEvent.pageIndex > this.pageEvent.previousPageIndex!) {
      this.from = this.from + this.pageSize
    } else { 
      this.from = this.from - this.pageSize
    }
    this.allEmployeesAssignedToClinic()

  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  removeallassigned() {
    if (this.hasAssignments) {  
      this.clinicAssignment.removeAllDoctorsAssignedToClinic(this.clinic_id).subscribe(
        (resp: any) => { 
            if (resp.ok) {
              this.updateProfileService.clinicToUpdate(resp.clinic);
            this.store.dispatch(ui.isLoadingTable());
            success(resp.message);
          }
        }, (err: any) => {
          error(err.error.message)
        }
      );    
    }
  }
  removeADoctorAssigned(reference: string, doctor_id: string) {
    if (this.hasAssignments && doctor_id) { 
      this.clinicAssignment.removeADoctorAssignedToClinic(reference,  this.clinic_id, doctor_id,).subscribe(
        (resp: any) => { 
            if (resp.ok) {
            this.updateProfileService.clinicToUpdate(resp.clinic);
            this.store.dispatch(ui.isLoadingTable());
            success(resp.message);
          }
        }, (err: any) => {
          error(err.error.message)
        }
      );    
     }
  }

  assignmentListDialog(): void {
    this.matDialog.open(ClinicAssignmentDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
      data: { doctors:this.doctorsAvailableList, clinic: this.clinic_id }
    });
  } 

}
