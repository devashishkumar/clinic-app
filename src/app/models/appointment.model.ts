export class Appointment {

    constructor(
        public appointment_id:string,
        public start: Date,
        public end: Date,
        public title: string,
        public clinic: string,
        public clinic_info:string,
        public doctor: string,
        public doctor_info:string,
        public patient: string,
        public createdby: string
    ){}

}