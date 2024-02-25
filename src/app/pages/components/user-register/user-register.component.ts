import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { UiService } from 'src/app/services/ui.service';
import { UserService } from 'src/app/services/user.service';
import { PatientService } from 'src/app/services/patient.service';
import { CloudinaryService } from 'src/app/services/cloudinary.service';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ]
})
export class UserRegisterComponent {
  public formSub$!: Subscription;
  public isFirstStepValid : boolean = false;
  public document_type: string = 'DUI';
  public email_provider: string = '@gmail.com';
  public currentStep : number = 1  ;
  public formSubmitted:boolean = false;
  public registerForm!: FormGroup;
  public imagenTemp!: any;
  public rol!: string | null;

  constructor(
    private formbuilder: FormBuilder,
    private userservice: UserService,
    private patientService: PatientService,
    private cloudinary: CloudinaryService,
    private store: Store<AppState>,
    private ui: UiService,
    public matdialogRef: MatDialogRef<UserRegisterComponent>,

  ) { }

  ngOnInit() {
    this.rol = this.ui.currentUserToEnrrolled
    this.registerForm = this.formbuilder.group({
      personalInformation: this.formbuilder.group({
        document_type: [this.document_type, Validators.required],
        document_number: [null, Validators.required],
        email_provider: [this.email_provider, Validators.required],
        email_name: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(25), this.forbiddenInputMailValidator()]],
        name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25), this.forbiddenInputTextValidator()]],
        lastname: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25),this.forbiddenInputTextValidator()] ],
        phone: [null, Validators.required],
        gender: [null, Validators.required],
        rol: [this.rol, Validators.required],
      }),
      photo:[''],
      photoSrc: ['']
    });
    
    this.formSub$ = this.registerForm.get('personalInformation')!.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.isFirstStepValid = true;
        this.verifyFirstStep;
      }
      else {
        this.isFirstStepValid = false;
        this.verifyFirstStep;
      }
    })
    this.registerForm.get('personalInformation.document_type')?.valueChanges.subscribe(value => this.document_type = value) 
  }

  ngOnDestroy(): void {
    this.formSub$.unsubscribe;
  }
  preparePhoto(event: any) {
    const photo = event.files[0]
    this.registerForm.patchValue({ 'photoSrc': photo })
    if (!photo) {
      return this.imagenTemp = null
    }
    const renderImg = new FileReader();
    renderImg.readAsDataURL(photo);
    renderImg.onloadend = () => { 
      this.imagenTemp = renderImg.result;
    }
    return this.imagenTemp
  }
  async uploadPhoto(id: string, schema: string) {
      this.store.dispatch(ui.isLoadingTable())
      const formData = new FormData();
      formData.append('photo', this.registerForm.get('photoSrc')?.value)     
        await this.cloudinary.uploadImageCloudinary(id, formData, schema ).subscribe(
          (resp: any) => {
            if (resp.ok) {
              success(resp.message)
              this.store.dispatch(ui.isLoadingTable())
              formData.delete,
              this.imagenTemp = null;
            }
          },
          (err) => error(err.error.message)
    );
  }

  createUser() {
    if (this.isFirstStepValid) {   
        const { personalInformation, photo } = this.registerForm.value
        const newRegisterForm = {
          document_type: personalInformation.document_type,
          document_number: personalInformation.document_number,
          email_provider: personalInformation.email_provider,
          email_name: personalInformation.email_name,
          email: personalInformation.email_name.trim()+ personalInformation.email_provider,
          name: personalInformation.name.trim(),
          lastname: personalInformation.lastname.trim(),
          phone: personalInformation.phone,
          gender: personalInformation.gender,
          rol: personalInformation.rol,
          photo
        }
      
      if ( personalInformation.rol==='patient') {
        this.patientService.crearteNewPatientWithEmailAndPassword(newRegisterForm).subscribe(async (resp:any) => { 
          if (resp.ok && this.registerForm.get('photoSrc')?.value) { 
            await this.uploadPhoto(resp.patient.id, 'patients')
          }
          success(resp.message);
          this.store.dispatch(ui.isLoadingTable())
          this.currentStep = 1;
          this.registerForm.reset();
          this.matdialogRef.close();

        }, (err)=>error(err.error.message));
      }
      if (['doctor', 'operator'].includes(personalInformation.rol)) {
        this.userservice.crearteNewUserWithEmailAndPassword(newRegisterForm).subscribe(async (resp:any) => { 
          if (resp.ok && this.registerForm.get('photoSrc')?.value) { 
            await this.uploadPhoto(resp.user.id, 'users')  
            
          }
          success(resp.message)
          this.store.dispatch(ui.isLoadingTable())
          this.currentStep = 1;
          this.registerForm.reset();
          this.matdialogRef.close();
        }, (err)=>error(err.error.message));
      }
    
    }
     
  }
  get verifyFirstStep() {return this.isFirstStepValid;}
  get document_number() { return this.registerForm.get('personalInformation.document_number'); }
  get name() { return this.registerForm.get('personalInformation.name'); }
  get lastname() { return this.registerForm.get('personalInformation.lastname'); }
  get email_name() { return this.registerForm.get('personalInformation.email_name'); } 
  get photo() { return this.registerForm.get('photo') }
  get phone() { return this.registerForm.get('personalInformation.phone'); }
  
  

  forbiddenInputTextValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z\s]+[a-zA-Z]+$/
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }

  forbiddenInputMailValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9._]+[a-zA-Z0-9._]+$/
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }
  
  nextPage() {
    if (  this.isFirstStepValid ) { this.currentStep = this.currentStep+1 }
  }
  previusPage() { this.currentStep = this.currentStep - 1 }
  
}
