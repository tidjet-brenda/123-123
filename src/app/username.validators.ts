import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UsernameValidators{

    static cannotContainSpace(control:AbstractControl):ValidationErrors | null {

        if((control.value as string).indexOf(' ') >= 0 ){
            
            return { cannotContainSpace:true };
        }
        return null;
    }

    static shouldBeUnique(control:AbstractControl):Promise<ValidationErrors>|null{

        return new Promise(

            (resolve,reject)=>{

                setTimeout(()=>{

                     if(control.value === 'OUATTARA'){
                        resolve ({shouldBeUnique:true}); 
                     }else{
                        resolve (null ) ;
                     }

                },2000);
            }
        );
    }

    static testUsername(control:AbstractControl):ValidationErrors|null{
        
        if(control.value==='OUATTARA')
        {
            return {testUsername:true};
        }else{
            return null;
        }
    }

}