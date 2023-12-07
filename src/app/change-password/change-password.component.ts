import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { GamemasterService } from 'src/gamemaster.service';
import { CheckGmPassDto } from '../check-gm-pass-dto';
import { AuthService } from '../auth-service';
import { catchError } from 'rxjs';
import { ChangeGmPassDto } from '../change-gm-pass-dto';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterModule , ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  passwordError: string = ""
  showPasswordError: boolean = false;
  confirmedPasswordError: string = ""
  showConfirmedPasswordError: boolean = false
  errorMessage: string = "";
  showErrorModal: boolean = false
  successMessage: string = "Password was updated!"
  showSuccessMessage: boolean = false


passwordForm = new FormGroup({
  password: new FormControl ('',[Validators.required, Validators.minLength(8), Validators.maxLength(32), this.passwordValidator]),
  confirmedPassword: new FormControl ('', [Validators.required]),
});

constructor(private gamemasterService : GamemasterService, private router: Router, private auth: AuthService){

}

passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
  const valid = passwordRegex.test(control.value);
  return valid ? null : { 'invalidPassword': true };
}

onSubmit(){
  if(this.passwordForm.valid){

    const dto : ChangeGmPassDto = {
      id: Number.parseInt(this.auth.getGmId()!) ,
      password: this.passwordForm.value.password!,
      confirmedPassword: this.passwordForm.value.confirmedPassword!
    }


    this.gamemasterService.changePass(Number.parseInt(this.auth.getGmId()!), dto)
    .pipe(
      catchError(error => {
        if ((error.status == 500 && error.error === "Db failure")) {
          this.errorMessage = "Could not perform operation due to an internal error."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        } else if(error.status == 400 && error.error != "Invalid data" && error.error != "Passwords do not match"){
          type ErrorsType = {
            [key: string]: Array<any>; 
          };           
           const errors : ErrorsType = error.error.errors
     
           if(errors){
            Object.keys(errors).forEach(k => {
              switch(k){
                case "ConfirmedPassword": {
                  this.confirmedPasswordError = errors["ConfirmedPassword"][0]
                  this.showConfirmedPasswordError = true;

                  setTimeout(() => {
                    this.showConfirmedPasswordError = false;
                  }, 5000);
                  break;
                }
                case "Password":{
                  this.passwordError = errors["Password"][0] as string
                  this.showPasswordError = true;

                  setTimeout(() => {
                    this.showPasswordError = false;
                  }, 5000);
                  break;
                }
                default: break;
              }
            })
           }              
        }else if(error.status === 400 && error.error ==="Passwords do not match"){
          this.confirmedPasswordError = error.error
          this.showConfirmedPasswordError = true;

          setTimeout(() => {
            this.showConfirmedPasswordError = false;
          }, 5000); 
        }else if(error.status === 401){
          this.errorMessage = "You are not authorized for that action."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        }else {
          this.errorMessage = "Could not perform operation due to an unexpected error."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        }
        return error
      }) 
    )
    .subscribe(() =>{
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000); 
    })
  } else{
    this.errorMessage = "Please provide the right inputs."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
  }
}
}
