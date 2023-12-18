import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';

import { GamemasterService } from 'src/gamemaster.service';
import { AuthService } from '../auth-service';
import { GmUpdateDto } from '../../interfaces/gamemaster-interfaces/gm-update-dto';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule ],
  
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  usernameError : string = ""
    showUsernameError : boolean = false;
    emailError: string = ""
    showEmailError: boolean = false;
    errorMessage: string = "";
    showErrorModal: boolean = false
    successMessage: string = "Gamemaster was updated!"
    showSuccessMessage: boolean = false
    showDeleteModal: boolean = false


  constructor(private authSer: AuthService,private gamemasterService : GamemasterService, private router: Router){
  }

  
    accountForm =  new FormGroup({
      username: new FormControl (this.authSer.getGmName(), [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      email: new FormControl (this.authSer.getGmEmail(), [Validators.required, Validators.minLength(10), Validators.maxLength(100), Validators.email]),     
    });



  update(){
    if(this.accountForm!.valid){
      console.log("Form is valid")
     const dto: GmUpdateDto = {
      id: Number.parseInt(this.authSer.getGmId()!),
      username: this.accountForm!.value.username!,
      email: this.accountForm!.value.email!
     }

     this.gamemasterService.update(dto, Number.parseInt(this.authSer.getGmId()!))
     .pipe(
      catchError(error => {
        if ((error.status == 500 && error.error === "Db failure")) {
          this.errorMessage = "Could not perform update operation due to an internal error."
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
        }else if(error.status === 400){
          this.errorMessage = "You are not authorized for this operation"
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        } else {
          this.errorMessage = "Could not perform update operation due to an unexpected error."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        }
        return error
      }) 
    ).subscribe(gm =>{
       const gamemaster : GmUpdateDto = gm as GmUpdateDto

       this.authSer.setGmId(gamemaster.id)
       this.authSer.setGmEmail(gamemaster.email)
       this.authSer.setGmName(gamemaster.username)

      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000); 
    })

    } else console.log("Form is not valid")
  }



  continue(){
    this.gamemasterService.deleteGamemaster(Number.parseInt(this.authSer.getGmId()!))
    .pipe(
      catchError(error => {
        if ((error.status === 500 && error.error === "Db failure")) {
          this.errorMessage = "Could not perform delete operation due to an internal error."
          this.showDeleteModal = false
          this.showErrorModal = true;
        

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        } else {
          console.log(error)
          console.log(error.error)
          this.errorMessage = "Could not perform delete operation due to an unexpected error."
          this.showDeleteModal = false
          this.showErrorModal = true;
       

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        }
        return error
      }) 
    )
    .subscribe(() =>{
      this.showDeleteModal = false
      this.authSer.setAuthToken("")
      this.authSer.setGmEmail("")
      this.authSer.setGmName("")
      this.authSer.setGmId(0)
      this.router.navigate(["/"])
    })
  }

  stop(){
    this.showDeleteModal = false
  }

  deleteGm(){
    this.showDeleteModal = true
  }
}
