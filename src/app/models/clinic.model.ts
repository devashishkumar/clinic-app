
export class Clinic {

    constructor(
        public clinic_id:string,
        public register_number: string,
        public name: string,
        public phone: string,
        public province: string,
        public city: string,
        public street: string,
        public register_by: string,
        public validationState: boolean,
        public hasAssignments:boolean,
        public photo?: string,
    ){}

}