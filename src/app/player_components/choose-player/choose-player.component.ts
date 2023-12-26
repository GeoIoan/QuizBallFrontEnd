import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Game } from 'src/interfaces/game-interfaces/game';
import { ParticipantService } from 'src/app/participant.service';
import { catchError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Participant } from 'src/interfaces/participant-interfaces/participant';
import { GameData } from 'src/app/game-data';
import { AuthService } from 'src/app/auth-service';

@Component({
  selector: 'app-choose-player',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './choose-player.component.html',
  styleUrls: ['./choose-player.component.css']
})

/**
 * This class contains the logic of the
 * ChoosePlayerComponent which is used
 * whenever a gamemaster chooses to start
 * a tvt(Team versus Team) game. 
 */
export class ChoosePlayerComponent {
    gameData: GameData | null | undefined;
    participants: any[] = [];
    playerName: string = '';
    errorContainerIsVisible: boolean = false;
    successContainerIsVisible: boolean = false;
    errorMessage: string = '';
    successMessage: string = '';
    player1: string = '';
    player2: string = '';
    showNameError: boolean = false
  
    constructor(private authSer: AuthService ,private participantService: ParticipantService, private route: ActivatedRoute, private router: Router) {
      this.route.queryParams.subscribe(params => {
        this.gameData = params['gameData'] ? JSON.parse(params['gameData']) as GameData : null;
       
        console.log(this.gameData)
      });
      this.fetchParticipants();
    }
  
    ngOnInit(): void {
    }
  
    /**
     * This method get the existing teams
     * of a specific gamemaster form the
     * back-end server and then populates
     * the comboboxes with these data.
     */
    private fetchParticipants(): void {
      this.participantService.getParticipantByType(Number.parseInt(this.authSer.getGmId()!), 'player')
        .pipe(
          catchError(error => {
            if (error.status === 500 && error.error == "Db failure") {
              this.errorContainerIsVisible = true;
              this.errorMessage = "An internal error occurred while loading the page.";

              setTimeout(() => {
                this.errorContainerIsVisible = false;
              }, 3000); 
            } else if (error.status === 404) {
              this.errorContainerIsVisible = true;
              this.errorMessage = "No players where found. Create new players!";

              setTimeout(() => {
                this.errorContainerIsVisible = false;
              }, 3000); 
            } else {
              this.errorContainerIsVisible = true;
              this.errorMessage = "An unexpected error occurred while loading the page.";

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

      createPlayer(){
        this.errorContainerIsVisible = false;
        this.successContainerIsVisible = false;
      
        if (this.playerName === "") {
        this.showNameError = true;
        this.errorMessage = "Please write a name"  

        setTimeout(() => {
          this.showNameError = false;
        }, 3000);
      }else{
        this.create()
      }
    }

    /**
     * This method is called whenever the
     * gamemaster wants to create a new team.
     */
    private create(): void{
      const participant : Participant = {
        id: 0,
        name: this.playerName,
        type: "Player",
        members: null,
        wins: null,
        gamemasterId: Number.parseInt(this.authSer.getGmId()!)
      }
      console.log(participant)
      this.participantService.createParticipant(participant)
      .pipe(
        catchError(error => {
          if (error.status === 500 && error.error === "Db failure") {
            this.errorContainerIsVisible = true;
            this.errorMessage = "An internal error occurred while creating player";

            setTimeout(() => {
              this.errorContainerIsVisible = false;
            }, 3000); 
          } else if (error.status === 400 && error.error === "Unavailable name"){
            this.showNameError = true;
            this.errorMessage = "This name is not available";

            setTimeout(() => {
              this.errorContainerIsVisible = false;
            }, 3000);
          }else if(error.status === 400 && error.error != "Invalid data" && error.error != "Unavailable name"){
            this.showNameError = true;
            this.errorMessage = "Players name can be between 3 and 50 characters long.";

            setTimeout(() => {
              this.errorContainerIsVisible = false;
            }, 3000);
          } else {
            this.errorContainerIsVisible = true;
            this.errorMessage = "An unexpected error occured while creating participant.";

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

   /**
    * This method is called whenever the gamemaster
    * is ready and wants to continue to the game screen.
    */
    goToGameScreen(){
      this.successContainerIsVisible = false;
     
      if(this.player1 != "" && this.player2 != "") {
        if(this.player1 === this.player2) {
          this.errorContainerIsVisible = true;
          this.errorMessage = "Please do not choose the same players" 

          setTimeout(() => {
            this.errorContainerIsVisible = false;
          }, 3000);
        } else{
          if(this.gameData) {  
            
          let wins1 : number = 0
          let wins2 : number = 0
          let player1Name: string = ""
          let player2Name: string = ""

        this.participants.forEach(p => {
          if(p.id == this.player1){
            wins1 = p.wins 
            player1Name = p.name
            this.gameData!.participants.participant1 = p as Participant
          } 
          if(p.id == this.player2){
            wins2 = p.wins 
            player2Name = p.name
            this.gameData!.participants.participant2 = p as Participant
          } 
        })

        
        this.gameData.wins1 = wins1
        this.gameData.wins2 = wins2
        this.gameData.participant1 = player1Name
        this.gameData.participant2 = player2Name

        console.log("Player1name: ", this.gameData.participant1)
        console.log("Player2name: ", this.gameData.participant2)
      }
        
        console.log(this.gameData)
        this.router.navigate(['main-menu/quick-game/pvp/game-screen'], { 
                              queryParams: {gameData: JSON.stringify(this.gameData), 
                              }})    
        }      
      } else {
        this.errorContainerIsVisible = true;
        this.errorMessage = "Please choose players before proceeding" 

        setTimeout(() => {
          this.errorContainerIsVisible = false;
        }, 3000);
      }
    }
  }




