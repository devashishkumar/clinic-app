import { Rol } from "../interfaces/authorized-roles.enum";

export class User {

    constructor(
        public id: string,
        public document_type: string,
        public document_number: string,
        public email: string,
        public name: string,
        public lastname: string,
        public gender: string,
        public phone: string,
        public validationState: boolean,
        public email_name: string,
        public email_provider: string,
        public rol: Rol.ADMIN | Rol.DOCTOR | Rol.OPERATOR,
        public photo?: string
    ){}

}