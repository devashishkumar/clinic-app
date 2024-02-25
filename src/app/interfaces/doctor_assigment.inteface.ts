import { User } from "../models/user.model";

export interface DoctorAssigned extends User {
    doctor_id: string,
    name: string,
    lastname: string,
    photo: string,
    reference: string
}