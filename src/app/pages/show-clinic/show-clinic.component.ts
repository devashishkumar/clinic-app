import { Component } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, Validators, FormGroup } from '@angular/forms';

import Swal from 'sweetalert2';

import { CloudinaryService } from 'src/app/services/cloudinary.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { UpdateProfileService } from 'src/app/services/update-profile.service';
import { AuthService } from 'src/app/services/auth.service';

import { Clinic} from 'src/app/models/clinic.model';
import { Rol } from 'src/app/interfaces/authorized-roles.enum';

import provicesAndCities from 'src/assets/ElSalvadorCities.json';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-clinic',
  templateUrl: './show-clinic.component.html',
  styles: [
  ]
})
  
export class ShowClinicComponent {
  public formSub$!: Subscription;
  public profileSelected!: Clinic;
  public userRol!: Rol;
  public isLoading: boolean = false;
  public somethingChanged: boolean = false;
  // ?Information Form
  public cities!: string[];
  public profileForm!: FormGroup;
  public provinces!: string[];

  // ?Photo Form
  public currectPhoto!: string | undefined;
  public imagenTemp!: any
  public photoForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private clinicService: ClinicService,
    private cloudinary: CloudinaryService,
    private formbuilder: FormBuilder,
    public updateProfileService: UpdateProfileService

  ) { 
    this.profileSelected = updateProfileService.clinicProfileToUpdate;
    this.currectPhoto = updateProfileService.clinicProfileToUpdate.photo;

  }

  ngOnInit() {
    this.userRol = this.authService.userRol;
    this.profileForm = this.formbuilder.group({
      information: this.formbuilder.group({
        register_number: [this.profileSelected.register_number, Validators.required],
        name: [this.profileSelected.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        phone: [this.profileSelected.phone, Validators.required],
      }),
      address: this.formbuilder.group({
        country: [{ value:'El Salvador', disabled: true }],
        province: [this.profileSelected.province, [Validators.required]],
        city: [this.profileSelected.city, Validators.required],
        street:[this.profileSelected.street, Validators.required]
      })
    });

    this.photoForm = this.formbuilder.group({
      photo: [''],
      photoSrc:['']
    })
   
    if (this.userRol!=='admin') {
      this.profileForm.disable()
    }

    this.formSub$ = this.profileForm.statusChanges.subscribe(value => {
      if (value === 'VALID') {
        this.somethingChanged = true;
        this.hasChanges;
      } else { 
        this.somethingChanged = false;
        this.hasChanges;
      }
    })
    this.provinces = provicesAndCities.map(({ province }) => province);
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('profile-to-show');
    sessionStorage.removeItem('current-photo-profile');
    this.formSub$.unsubscribe;
  }
  get hasChanges(){ return this.somethingChanged }


  updateProfile() {
    if ( !this.profileForm.errors ) {   
      const { information, address } = this.profileForm.value;
      const newUpdateForm = {
        register_number: information.register_number,
        phone: information.phone,
        name: information.name,
        country: 'El Salvador',
        province: address.province,
        city: address.city,
        street: address.street
      }
      this.clinicService.updateClinic(newUpdateForm, this.profileSelected.clinic_id).subscribe((resp: any)=> { 
        if (resp.ok) {
          this.updateProfileService.clinicToUpdate(resp.clinic);
          this.profileSelected = this.updateProfileService.clinicProfileToUpdate;
          success(resp.message);
        }
      }, (err: any) => {
        error(err.error.message);
      });    
    }
  }

  get name() { return this.profileForm.get('information.name'); }
  get street() { return this.profileForm.get('address.street'); }
  get nameProvince() { return this.profileForm.get('address.province')?.value; }
  get citiesByProvince() {
    const province = provicesAndCities.filter(province => province.province === this.nameProvince)
    return province[0].cities
  }
  get register_number() { return this.profileForm.get('information.register_number');}
  get phone_number(){return this.profileForm.get('information.phone');}
  get province() {return this.profileForm.get('address.province');}
  get city() { return this.profileForm.get('address.city');}
  get country(){ return this.profileForm.get('address.country');}

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
    let schema: string='clinics';
    this.uploadPhoto(this.profileSelected.clinic_id, schema);
  }

  deletePhoto(id: string) {
    let schema: string='clinics';
    Swal.fire({
      title: 'Are you sure?, Do you want to delete your current photo',
      icon: 'warning',
      iconColor: '#dc2626',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#dc2626',
      width: '75%',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cloudinary.destroyImageCloudinary(id, schema).subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.updateProfileService.clinicToUpdate({ ...this.profileSelected, photo: resp.photo });
              this.updateProfileService.deletePhoto();
              this.currectPhoto = this.updateProfileService.currentPhoto;
              success(resp.message);
            }
          },
          (err) => error(err.error.message)
        );
      }
    });
  }
  async uploadPhoto(id: string, schema: string) {
      const formData = new FormData();
      formData.append('photo', this.photoForm.get('photoSrc')?.value);   
      this.isLoading = true;    
        await this.cloudinary.uploadImageCloudinary(id, formData, schema ).subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.isLoading = false;
              this.updateProfileService.clinicToUpdate({ ...this.profileSelected, photo: resp.photo });
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

  forbiddenInputTextValidator(): ValidatorFn{
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9._]+[a-zA-Z0-9._]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }


}
