import { Clinic } from "../models/clinic.model";

export interface ClinicAvailableToMakeAnAppointment extends Clinic {
    clinic_id: string,
    register_number:string, 
    name: string,
    province: string,
    city: string
}