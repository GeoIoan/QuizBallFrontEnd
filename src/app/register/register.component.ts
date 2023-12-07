import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { Gamemaster } from 'src/interfaces/gamemaster-interfaces/gamemaster';
import { GamemasterService } from 'src/gamemaster.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    usernameError : string = ""
    showUsernameError : boolean = false;
    passwordError: string = ""
    showPasswordError: boolean = false;
    confirmedPasswordError: string = ""
    showConfirmedPasswordError: boolean = false
    emailError: string = ""
    showEmailError: boolean = false;
    errorMessage: string = "";
    showErrorModal: boolean = false
    

    registerForm = new FormGroup({
      username: new FormControl ('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      password: new FormControl ('',[Validators.required, Validators.minLength(8), Validators.maxLength(32), this.passwordValidator]),
      confirmedPassword: new FormControl ('', [Validators.required]),
      email: new FormControl ('', [Validators.required, Validators.minLength(10), Validators.maxLength(100), Validators.email]),     
    });

    constructor(private gamemasterService : GamemasterService, private router: Router){
    
    }


    passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
      const valid = passwordRegex.test(control.value);
      return valid ? null : { 'invalidPassword': true };
    }
  
  //   confirmedPasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {  
  //     if (!this || !this.registerForm) {
  //         // Handle the case where 'this' or 'registerForm' is undefined
  //         return { 'passwordMismatch': false };
  //     }
  
  //     const passwordControl = this.registerForm.get('password');
      
  //     if (!passwordControl) {
  //         // Handle the case where 'passwordControl' is null
  //         return { 'passwordMismatch': false };
  //     }
  
  //     const password = passwordControl.value;
  //     const confirmedPassword = control.value;
  //     const valid = password === confirmedPassword;
  
  //     return valid ? null : { 'passwordMismatch': true };
  // }
  
  
  
  
  


  onSubmit() {   
      if(this.registerForm.valid){
      const registerDTO : Gamemaster = this.registerForm.value as Gamemaster  

      this.gamemasterService.register(registerDTO)
      .pipe(
        catchError(error => {
          if ((error.status == 500 && error.error === "Db failure")) {
            this.errorMessage = "Could not perform Sign Up operation due to an internal error."
            this.showErrorModal = true;
  
            setTimeout(() => {
              this.showErrorModal = false;
            }, 5000); 
          } else if(error.status == 400 && error.error != "Invalid data"){
            type ErrorsType = {
              [key: string]: Array<any>; 
            }; 

             const errors1 = error.error
             const errors2 : ErrorsType = error.error.errors

             Object.keys(errors1).forEach(k => {
              switch(k){
                case "Username": {
                  this.usernameError = errors1["Username"] as string
                  this.showUsernameError = true;

                  setTimeout(() => {
                    this.showUsernameError = false;
                  }, 5000); 
                  break;
                }
                case "Password":{
                  this.passwordError = errors1["Password"] as string
                  this.showPasswordError = true;

                  setTimeout(() => {
                    this.showPasswordError = false;
                  }, 5000);
                  break;
                }
                case "ConfirmedPassword":{
                  this.confirmedPasswordError = errors1["ConfirmedPassword"] as string
                  this.showConfirmedPasswordError = true;

                  setTimeout(() => {
                    this.showConfirmedPasswordError = false;
                  }, 5000);
                  break;
                }
                case "Email": {
                  this.emailError = errors1["Email"] as string
                  this.showEmailError = true;

                  setTimeout(() => {
                    this.showEmailError = false;
                  }, 5000); 
                  break;
                }
              }
             })

             if(errors2){
              Object.keys(errors2).forEach(k => {
                switch(k){
                  case "Username": {
                    this.usernameError = errors2["Username"][0]
                    this.showUsernameError = true;

                    setTimeout(() => {
                      this.showUsernameError = false;
                    }, 5000);
                    break; 
                  }
                  case "ConfirmedPassword": {
                    this.confirmedPasswordError = errors2["ConfirmedPassword"][0]
                    this.showConfirmedPasswordError = true;

                    setTimeout(() => {
                      this.showConfirmedPasswordError = false;
                    }, 5000);
                    break;
                  }
                  case "Password":{
                    this.passwordError = errors2["Password"][0] as string
                    this.showPasswordError = true;

                    setTimeout(() => {
                      this.showPasswordError = false;
                    }, 5000);
                    break;
                  }
                  case "Email": {
                    this.emailError = errors2["Email"][0] as string
                    this.showEmailError = true;

                    setTimeout(() => {
                      this.showEmailError = false;
                    }, 5000);
                    break;
                  }
                  default: break;
                }
              })
             }              
          }else {
            this.errorMessage = "Could not perform Sign Up operation due to an unexpected error."
            this.showErrorModal = true;
  
            setTimeout(() => {
              this.showErrorModal = false;
            }, 5000); 
          }
          return error
        }) 
      )
      .subscribe(() =>
        this.router.navigate(['/'])
      )
    }
  }

}
