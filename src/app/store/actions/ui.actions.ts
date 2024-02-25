import { createAction, props } from '@ngrx/store';
import { Clinic } from 'src/app/models/clinic.model';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';


export const isLoadingTable = createAction('[UI Tables] Is Loading');
export const isLoadedUserTable = createAction('[UI Tables] Load Users',
    props < { itemList: User[] }>()
);
export const isLoadedPatientTable = createAction('[UI Tables] Load Patients',
    props < { itemList: Patient[] }>()
);
export const isLoadedClinicTable = createAction('[UI Tables] Load Clinics',
    props < { itemList: Clinic[] }>()

);
