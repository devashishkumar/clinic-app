
interface Doctor { 
    id:string
    name: string,
}
export class MedicalRecord {
    
    constructor(
        public id:string,
        public date: Date,
        public title: string,
        public body: string,
        public doctor: Doctor,
        public patient: string,
        public document_number:string
    ){}

}