import { User } from "../models/user.model";

export interface DoctorAvailable extends User {
    id: string,
    name: string,
    lastname: string,
    photo: string,
}