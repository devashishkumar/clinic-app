import Swal from "sweetalert2"

const TIMER = 5000;

export const success = async (message:string) => {
   

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        iconColor: '#d1fae5',
        background: '#047857',
        showConfirmButton: false,
        showCloseButton: true,
        timer: TIMER,
        timerProgressBar: true,
        color: '#f9fafb',
        
        
        
    })

    await Toast.fire({
        icon:'success',
        title: message || 'Success',
    })
      
}
export const error = async (error:string) => {
   
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        iconColor: '#ffe4e6',
        background: '#be123c',
        showConfirmButton: false,
        showCloseButton: true,
        timer: TIMER,
        timerProgressBar: true,
        color: '#f9fafb',
        
      })
  
    await Toast.fire({
    icon: 'error',
    title: error || 'Something Went Wrong'
    })

      
}