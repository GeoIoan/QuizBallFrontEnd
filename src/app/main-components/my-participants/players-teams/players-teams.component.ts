import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ParticipantService } from 'src/app/participant.service';
import { catchError } from 'rxjs';
import { Participant } from 'src/interfaces/participant-interfaces/participant';
import { FormsModule } from '@angular/forms';
import { ParticipantsName } from 'src/interfaces/participant-interfaces/participants-name';
import { AuthService } from 'src/app/auth-service';

@Component({
  selector: 'app-players-teams',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './players-teams.component.html',
  styleUrls: ['./players-teams.component.css']
})
export class PlayersTeamsComponent {
  participantsType : string = ""
  participants: any[] = [];
  name: string = ""
  showDeleteModal: boolean = false;
  participantsId: number = 0;
  errorMessage: string = "";
  showErrorModal: boolean = false

  constructor(private authSer: AuthService ,private participantService: ParticipantService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.participantsType = params['participants']
    });
    this.populateWithParticiapants()
  }


  populateWithParticiapants(){
    this.participantService.getParticipantByType(Number.parseInt(this.authSer.getGmId()!), this.participantsType)
    .pipe (
      catchError(error => {
        if (error.status === 500) {
        } else if (error.status === 404) {
        } else {
        } 
        return error
      }) 
    )
    .subscribe(p => {
      this.participants = p
    })    
  }

  changeName(participantName : string, participantsId : number){
    const input = document.getElementById(participantName) as HTMLInputElement;

    console.log(input.value)
    
    const dto : ParticipantsName = {
      participantId: participantsId,
      gamemasterId: Number.parseInt(this.authSer.getGmId()!),
      name: input.value
    }

    this.participantService.changeName(dto, Number.parseInt(this.authSer.getGmId()!))
    .pipe (
      catchError(error => {
        if (error.status === 500 && error.error === "Db failure") {
          this.errorMessage = "Could update participant due to an internal error."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 

        } else if (error.status === 400 && error.error === "Unavailable name"){
          this.errorMessage = "This name is not available."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        } else if (error.status == 401){
          this.errorMessage = "You are not authorized for this change."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        }
        else {
          this.errorMessage = "Could update participant due to an unexpected error."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        } 
        return error
      }) 
    )
    .subscribe(() =>
      this.populateWithParticiapants()
    )

  }

  deleteParticipant(participantsId : number){
    this.participantsId = participantsId;
    this.showDeleteModal = true;     
  }

  confrimDelete(){
    this.participantService.deleteParticipant(this.participantsId)
    .pipe (
      catchError(error => {
        if (error.status === 500 && error.error === "Db failure") {
          this.errorMessage = "Could delete participant due to an internal error."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        }else{
          this.errorMessage = "Could delete participant due to an unexpected error."
          this.showErrorModal = true;

          setTimeout(() => {
            this.showErrorModal = false;
          }, 5000); 
        }
        return error
      }) 
    )
    .subscribe(() =>
      this.populateWithParticiapants()
    )  

    this.showDeleteModal = false;
  }

  rejectDelete(){
    this.showDeleteModal = false;
  }
}
