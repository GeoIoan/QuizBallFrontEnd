import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { GamemasterService } from 'src/gamemaster.service';
import { Login } from 'src/interfaces/gamemaster-interfaces/login';
import { catchError } from 'rxjs';
import { Auth } from '../auth';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 * Thic class contains all the logic
 * of the Login Component.
 * 
 */
export class LoginComponent {
  usernameError : string = ""
    showUsernameError : boolean = false;
    passwordError: string = ""
    showPasswordError: boolean = false;
    errorMessage: string = "";
    showErrorModal: boolean = false


    constructor(private gamemasterService : GamemasterService, private router: Router, private authSer : AuthService){
  
    
    }

  loginForm = new FormGroup({
    username: new FormControl ('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    password: new FormControl ('',[Validators.required, Validators.minLength(8), Validators.maxLength(32), this.passwordValidator]),
  });

  
  /**
     * Checks if the provided password of
     * the gamemaster meets the nessecary
     * criteria.
     * @param control (AbstractControl) the provided password 
     * @returns ([key: string]: boolean | null) 'invalidPassword': true if the password is ok
     *           else null
     */
  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    const valid = passwordRegex.test(control.value);
    return valid ? null : { 'invalidPassword': true };
  }


  /**
     * This method is called when the user
     * presses the login button. If the 
     * data are valid and credentials ok
     * the process is completed and the gamemaster
     * is given access to the app.
     */
  onSubmit() {   
    if(this.loginForm.valid){
      const loginDTO = this.loginForm.value as Login
      this.gamemasterService.login(loginDTO)
      .pipe(
        catchError(error => {
          if ((error.status == 500 && error.error === "Db failure")) {
            this.errorMessage = "Could not perform Sign in operation due to an internal error."
            this.showErrorModal = true;
  
            setTimeout(() => {
              this.showErrorModal = false;
            }, 5000); 
          } else if(error.status == 400 && error.error != "Invalid data"){
            type ErrorsType = {
              [key: string]: Array<any>; 
            }; 
             
             const errors : ErrorsType = error.error.errors

             
             if(errors){
              Object.keys(errors).forEach(k => {
                switch(k){
                  case "Username": {
                    this.usernameError = errors["Username"][0]
                    this.showUsernameError = true;

                    setTimeout(() => {
                      this.showUsernameError = false;
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
          } else if(error.status === 401){
            this.errorMessage = "Wrong credentials.Please try again"
            this.showErrorModal = true;
  
            setTimeout(() => {
              this.showErrorModal = false;
            }, 5000); 
          }else {
            this.errorMessage = "Could not perform Sign in operation due to an unexpected error."
            this.showErrorModal = true;
  
            setTimeout(() => {
              this.showErrorModal = false;
            }, 5000); 
          }
          return error
        })
      )
      .subscribe(a => {
        const auth = a as Auth
        
        console.log(auth)

        this.authSer.setGmEmail(auth.gamemasterEmail)
        this.authSer.setGmId(auth.id)
        this.authSer.setGmName(auth.gamemasterName)
        this.authSer.setAuthToken(auth.securityToken)
      
        console.log("The token: ", this.authSer.getAuthToken())
        console.log(this.authSer.getGmEmail())
        console.log(this.authSer.getGmId())
        console.log(this.authSer.getGmName())
        this.router.navigate(['/main-menu']);
      })
    }
  
  }
}
