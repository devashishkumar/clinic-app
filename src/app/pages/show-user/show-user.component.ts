import { Component } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { UserService } from 'src/app/services/user.service';
import { PatientService } from 'src/app/services/patient.service';
import { UpdateProfileService } from 'src/app/services/update-profile.service';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import { AuthService } from 'src/app/services/auth.service';

import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { PasswordRecoveryComponent } from 'src/app/pages/components/password-recovery/password-recovery.component';
import { Subscription } from 'rxjs';
import { Rol } from 'src/app/interfaces/authorized-roles.enum';
   



@Component({
  selector: 'app-show-user',
  templateUrl: './show-user.component.html',
  styles: [
  ]
})
export class ShowUserComponent {
  public currentUserLogged!: User | Patient;
  public userRol!: Rol;
  public formSub$!: Subscription;
  public isLoading: boolean = false;
  public profileSelected!: User | Patient;
  public ShowPassWordButtom: boolean = false;
  public somethingChanged: boolean = false;
  //? User Information
  public document_type:string = 'DUI';
  public profileForm!: FormGroup;

  // ? User Photo
  public currectPhoto!: string | undefined;
  public imagenTemp!: any;
  public photoForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private cloudinary: CloudinaryService,
    private formbuilder: FormBuilder,
    private patientService: PatientService,
    private userService: UserService,
    public updateProfileService: UpdateProfileService,
    public matDialog: MatDialog

  ) { }

  ngOnInit() {
    this.profileSelected = this.updateProfileService.userProfileToUpdate;
    this.currectPhoto = this.updateProfileService.userProfileToUpdate.photo;
    this.currentUserLogged = this.authService.currentUserLogged;
    this.userRol = this.authService.userRol;
    this.profileForm = this.formbuilder.group({
      document_type: [this.profileSelected.document_type, Validators.required],
      document_number: [this.profileSelected.document_number, Validators.required],
      email_provider: [this.profileSelected.email_provider, Validators.required],
      email_name: [this.profileSelected.email_name, [Validators.required, Validators.minLength(10), Validators.maxLength(25), this.forbiddenInputMailValidator()]],
      name: [this.profileSelected.name, [Validators.required, Validators.minLength(3), Validators.maxLength(25), this.forbiddenInputTextValidator()]],
      lastname: [this.profileSelected.lastname, [Validators.required, Validators.minLength(3), Validators.maxLength(25),this.forbiddenInputTextValidator()] ],
      phone: [this.profileSelected.phone, Validators.required],
      gender: [this.profileSelected.gender, Validators.required],
    });

    this.photoForm = this.formbuilder.group({
      photo: [''],
      photoSrc:['']
    })
    
    if (this.userRol === 'admin' && (this.profileSelected.rol === 'admin' && (this.profileSelected.id !== this.currentUserLogged.id ))) {
      this.profileForm.disable()
    }
   
    if ((this.userRol!=='admin') && ( (this.profileSelected.id !== this.currentUserLogged.id ))) {
      this.profileForm.disable()
    }
    if ((this.userRol==='operator') && ( (this.profileSelected.id !== this.currentUserLogged.id ))) {
      this.profileForm.disable()
    }

    this.profileForm.get('personalInformation.document_type')?.valueChanges.subscribe(value => this.document_type = value);
    this.ShowPassWordButtom = (this.authService.currentUserLogged.id === this.profileSelected.id);

    this.formSub$ = this.profileForm.statusChanges.subscribe(value => {
      if (value === 'VALID') {
        this.somethingChanged = true;
        this.hasChanges;
      } else { 
        this.somethingChanged = false;
        this.hasChanges;
      }
    });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('profile-to-show');
    sessionStorage.removeItem('current-photo-profile');
    this.formSub$.unsubscribe;
  }

  updateProfile() {
    
    if ( !this.profileForm.errors ) {   

      const { document_type, document_number, email_name, email_provider,name, lastname, phone, gender } = this.profileForm.value;
        const newUpdateForm = {
          document_type,
          document_number,
          email_name,
          email_provider,
          email: email_name.trim()+email_provider,
          name: name.trim(),
          lastname: lastname.trim(),
          phone,
          gender
        }
      if (this.profileSelected.rol === 'patient') {
          this.patientService.updatePatient(newUpdateForm, this.profileSelected.id).subscribe((resp: any)=> { 
            if (resp.ok) {
              this.updateProfileService.userToUpdate(resp.patient);
              this.profileSelected = this.updateProfileService.userProfileToUpdate;
              success(resp.message);
            }
        }, (err: any) => {
            error(err.error.message);
        });
      } else {
        this.userService.updateUser(newUpdateForm, this.profileSelected.id).subscribe((resp: any)=> { 
          if (resp.ok) {
            this.updateProfileService.userToUpdate(resp.user);
            this.profileSelected = this.updateProfileService.userProfileToUpdate;
            success(resp.message);
          }
        }, (err: any) => {
          error(err.error.message);
        });
      }
      
          
    }
     
  }

  preparePhoto(event: any) {
    const photo = event.files[0];
    this.photoForm.patchValue({ 'photoSrc': photo });
    if (!photo) {
      return this.imagenTemp = null;
    }
    const renderImg = new FileReader();
    renderImg.readAsDataURL(photo);
    renderImg.onloadend = () => { 
      this.imagenTemp = renderImg.result;
    }
    return this.imagenTemp;
  }

  startLoaddingPhoto() {
    let schema!: string;
    if (this.profileSelected.rol === 'patient') {
      schema = 'patients';
    } else { schema='users'}
    this.uploadPhoto(this.profileSelected.id, schema);
  }

  deletePhoto(id: string) {
    let schema!: string;
    if (this.profileSelected.rol === 'patient') {
      schema = 'patients';
    } else { schema = 'users'; }
    Swal.fire({
      title: 'Are you sure?, Do you want to delete your current photo',
      icon: 'warning',
      iconColor: '#dc2626',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#dc2626',
      width:'75%',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cloudinary.destroyImageCloudinary(id, schema).subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.updateProfileService.userToUpdate({ ...this.profileSelected, photo: resp.photo });
              this.updateProfileService.deletePhoto();
              this.currectPhoto = this.updateProfileService.currentPhoto;
              success(resp.message);
            }
          },
          (err) => error(err.error.message)
        )
      }
    })
  }
  async uploadPhoto(id: string, schema: string) {
      const formData = new FormData();
      formData.append('photo', this.photoForm.get('photoSrc')?.value); 
      this.isLoading = true;    
        await this.cloudinary.uploadImageCloudinary(id, formData, schema ).subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.isLoading = false;
              this.updateProfileService.userToUpdate({ ...this.profileSelected, photo: resp.photo });
              this.updateProfileService.updatePhoto(resp.photo);
              this.currectPhoto = this.updateProfileService.currentPhoto;
              success(resp.message);
              formData.delete;
              this.photoForm.reset();
              this.imagenTemp = null;
            }
          },
          (err) => {
            formData.delete;
            this.photoForm.reset();
            this.isLoading = false;
            error(err.error.message);
          }
    );
  }

 

  get name() { return this.profileForm.get('name'); }
  get lastname() { return this.profileForm.get('lastname'); }
  get email_name() { return this.profileForm.get('email_name'); } 
  get document_number() { return this.profileForm.get('document_number'); }
  get phone() { return this.profileForm.get('phone'); }
  
  get hasChanges(){ return this.somethingChanged }
 
  forbiddenInputTextValidator(): ValidatorFn{
    const isForbiddenInput: RegExp = /^[a-zA-Z\s]+[a-zA-Z]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }

  forbiddenInputMailValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9._]+[a-zA-Z0-9._]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }
  openDialog(): void {
    this.matDialog.open(PasswordRecoveryComponent, {
      height:'70%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  } 

}
