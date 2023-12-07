import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Game } from 'src/interfaces/game-interfaces/game';
import { ParticipantService } from 'src/app/participant.service';
import { catchError } from 'rxjs';
import { Participant } from 'src/interfaces/participant-interfaces/participant';
import { FormsModule } from '@angular/forms';
import { GameData } from 'src/app/game-data';
import { AuthService } from 'src/app/auth-service';

@Component({
  selector: 'app-choose-team',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './choose-team.component.html',
  styleUrls: ['./choose-team.component.css']
})
export class ChooseTeamComponent {
  gameData: GameData | null | undefined;
  participants: any[] = [];
  teamsName: string = '';
  errorContainerIsVisible: boolean = false;
  successContainerIsVisible: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  team1: string = '';
  team2: string = '';
  showNameError: boolean = false

  constructor(private authSer: AuthService , private participantService: ParticipantService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.gameData = params['gameData'] ? JSON.parse(params['gameData']) as GameData : null;
      this.fetchParticipants();
      console.log(this.gameData)
    });
  }

  ngOnInit(): void {
  }

  private fetchParticipants(): void {
    const gmId = Number.parseInt(this.authSer.getGmId()!)

    this.participantService.getParticipantByType(gmId, 'team')
      .pipe(
        catchError(error => {
          if (error.status === 500 && error.eror == "Db failure") {
            this.errorContainerIsVisible = true;
            this.errorMessage = "An internal error occurred while loading the page";
          
            setTimeout(() => {
              this.errorContainerIsVisible = false;
            }, 3000);
          } else if (error.status === 404) {
            this.errorContainerIsVisible = true;
            this.errorMessage = "No teams where found. Create new teams!";
          
            setTimeout(() => {
              this.errorContainerIsVisible = false;
            }, 3000);
          } else {
            this.errorContainerIsVisible = true;
            this.errorMessage = "No participants found";


            setTimeout(() => {
              this.errorContainerIsVisible = false;
            }, 3000);
          } 
          return error
        }) 
      )
    .subscribe(participants => {
      this.participants = participants
    })
    }   

    createTeam(){
      this.errorContainerIsVisible = false;
      this.successContainerIsVisible = false;
    
      if (this.teamsName === "") {
      this.showNameError = true;
      this.errorMessage = "Please write a name"  

      setTimeout(() => {
        this.showNameError = false;
      }, 3000);
    }else{
      this.create()
    }
  }

  private create(): void{
    const participant : Participant = {
      name: this.teamsName,
      type: "Team",
      members: null,
      wins: 0,
      gamemasterId: Number.parseInt(this.authSer.getGmId()!) 
    }
    console.log(participant)
    this.participantService.createParticipant(participant)
    .pipe(
      catchError(error => {
        if (error.status === 500 && error.error === "Db failure") {
          this.errorContainerIsVisible = true;
          this.errorMessage = "An internal error occurred while creating team";

          setTimeout(() => {
            this.errorContainerIsVisible = false;
          }, 3000);
        } else if (error.status === 400 && error.error === "Unavailable name"){
          this.showNameError = true;
          this.errorMessage = "This name is not available";

          setTimeout(() => {
            this.errorContainerIsVisible = false;
          }, 3000);
        } else if(error.status === 400 && error.error != "Invalid data" && error.error != "Unavailable name"){
          this.showNameError = true;
          this.errorMessage = "Teams name can be between 3 and 50 characters long.";

          setTimeout(() => {
            this.errorContainerIsVisible = false;
          }, 3000);
        } else {
          this.errorContainerIsVisible = true;
          this.errorMessage = "An unexpected error occured while creating team.";
        
          setTimeout(() => {
            this.errorContainerIsVisible = false;
          }, 3000);
        }
        return error
      }) 
    ).subscribe((participant) => {
      this.successMessage = `${participant.name} was created`
      this.successContainerIsVisible = true;

      setTimeout(() => {
        this.successContainerIsVisible = false;
      }, 3000);
      this.fetchParticipants()
    })    
  }

 
  goToGameScreen(){
    this.successContainerIsVisible = false;
   
    if(this.team1 != "" && this.team2 != "") {
      if(this.team1 === this.team2) {
        this.errorContainerIsVisible = true;
        this.errorMessage = "Please do not choose the same team" 
      
        setTimeout(() => {
          this.errorContainerIsVisible = false;
        }, 3000);
      } else{
        if(this.gameData) {
        this.gameData.game.participant1Id = Number.parseInt(this.team1);
        this.gameData.game.participant2Id = Number.parseInt(this.team2); 
        

        let wins1 : number = 0
        let wins2 : number = 0
        let team1Name: string = ""
        let team2Name: string = ""

        this.participants.forEach(p => {
          if(p.id == this.team1){
            wins1 = p.wins 
            team1Name = p.name
          } 
          if(p.id == this.team2){
            wins2 = p.wins 
            team2Name = p.name
          } 
        }
      )
      this.gameData.wins1 = wins1
      this.gameData.wins2 = wins2
      this.gameData.participant1 = team1Name
      this.gameData.participant2 = team2Name
    }
       
        console.log(this.gameData)
        this.router.navigate(['main-menu/quick-game/tvt/game-screen'], { 
                              queryParams: {gameData: JSON.stringify(this.gameData) 
                              }})
      }
    } else {
      this.errorContainerIsVisible = true;
      this.errorMessage = "Please choose teams before proceeding" 
    
      setTimeout(() => {
        this.errorContainerIsVisible = false;
      }, 3000);
    }
  }
}
