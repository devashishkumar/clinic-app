export interface UserRegisterForm { 
    document_type: string,
    document_number: number,
    email:string
    name: string,
    lastname: string,
    phone:number
    gender: string,
    rol: string
    photo?: string

}