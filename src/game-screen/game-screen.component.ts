import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Game } from 'src/interfaces/game-interfaces/game';
import { ParticipantService } from 'src/app/participant.service';
import { GameData } from 'src/app/game-data';
import { catchError, max } from 'rxjs';
import { GameService } from 'src/game.service';
import { AddQuestionsDto } from 'src/interfaces/game-interfaces/add-questions-dto';


@Component({
  selector: 'app-game-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent {
  gameData: GameData | null | undefined;
  wins1: number | null | undefined
  wins2: number | null | undefined 
  participant1: string | null | undefined
  participant2: string | null | undefined
  score1: number = 0
  score2: number = 0
  showModal: boolean = false;
  winner: string = ""
  errorMessage: string = "";
  showError: boolean = false;

  constructor(private gameService: GameService,private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.gameData = params['gameData'] ? JSON.parse(params['gameData']) as GameData : null;
      if(this.gameData){
        this.wins1 = this.gameData.wins1
        this.wins2 = this.gameData.wins2
        this.participant1 = this.gameData.participant1
        this.participant2 = this.gameData.participant2         
      }  
    }); 
    console.log(this.gameData)  
  }

  ngOnInit(): void { 
    if(this.gameData){
      if(this.gameData.game.score){
        let [score1, score2] = this.gameData.game.score.split(":")
        this.score1 = Number.parseInt(score1)
        this.score2 = Number.parseInt(score2)
      }
     
      console.log("X2: ", this.gameData.x2) 

      if(!this.gameData.x2){
        if(this.gameData.pointx1 == true){
          if(this.gameData.whoPlays == 1 && this.gameData.rightOrWrong) this.score1 += 1      
          else if(this.gameData.whoPlays == 2 && this.gameData.rightOrWrong) this.score2 += 1 
        } else{
          if(this.gameData.whoPlays == 1 && this.gameData.rightOrWrong) this.score1 += this.gameData.dif    
          else if(this.gameData.whoPlays == 2 && this.gameData.rightOrWrong) this.score2 += this.gameData.dif
        }
      } else {  
        if(this.gameData.pointx1 == true){
          if(this.gameData.whoPlays == 1 && this.gameData.rightOrWrong) this.score1 += 2     
          else if(this.gameData.whoPlays == 2 && this.gameData.rightOrWrong) this.score2 += 2  
        } else{   
          if(this.gameData.whoPlays == 1 && this.gameData.rightOrWrong) this.score1 += (this.gameData.dif * 2)    
          else if(this.gameData.whoPlays == 2 && this.gameData.rightOrWrong) this.score2 += (this.gameData.dif * 2)    
        } 
      }

      this.gameData.game.score = this.score1.toString() + ":" + this.score2.toString()

      const winner = this.findWinner()

      if(winner == "") return     
      else{
         if(this.gameData){
          this.gameData.game.endDate = new Date();
          this.gameData.game.score = this.score1.toString() + ":" + this.score2.toString()
          this.gameData.game.winner = winner
        }
        
        if(this.gameData)
        console.log("The game: ", this.gameData.game)
        this.gameService.createGame(this.gameData.game)
        .pipe(
          catchError(error => {
            if(error.status === 500 && error.message === "Db failure"){
              this.errorMessage = "An internal error occured while wraping up the game."
              this.showError = true;
            } else{
              this.errorMessage = "An unexpected error occured while wraping up the game"
              this.showError = true;
            }
            return error
          })  
        )
        .subscribe((g) => {                  
              if (this.gameData){ 
                this.gameData.participants.id = g.id
                
                this.gameService.addQuestionsToGame({
                gameId: g.id,
                questions: this.gameData.questions
              })
              .pipe(
                catchError(error => {
                  if(error.status === 500 && error.message === "Db failure"){
                    this.errorMessage = "An internal error occured while wraping up the game."
                    this.showError = true;
                  } else{
                    this.errorMessage = "An unexpected error occured while wraping up the game"
                    this.showError = true;
                  }
                  return error
                })        
              )
              .subscribe(() =>{
                this.gameService.addParticipantsToGame(this.gameData!.participants)
                .pipe(
                  catchError(error => {
                    if(error.status === 500 && error.message === "Db failure"){
                      this.errorMessage = "An internal error occured while wraping up the game."
                      this.showError = true;
                    } else{
                      this.errorMessage = "An unexpected error occured while wraping up the game"
                      this.showError = true;
                    }
                    return error
                  })        
                )
                .subscribe(() =>{
                  switch(winner){
                    case "No Winner": {
                      this.winner = "Its a tie!";
                      break;
                    }
                    default:{
                      this.winner= winner;
                      break;
                    }
                  }
                  
                  this.showModal = true;

                })               
              })
            }         
          }          
        )        
      }
    }    
  }

    play(){
      if(this.gameData) {
        if (this.gameData.round == 1) {
          this.gameData.game.startdate = new Date();
        
        }else{
          if(this.gameData.whoPlays == 1) this.gameData.whoPlays = 2
          else this.gameData.whoPlays = 1
          console.log(this.gameData.whoPlays)
        }
           

          this.gameData.round++         
          this.gameData.pointx1 = false;
          
     
        if(this.gameData.game.type === "pvp"){
        this.router.navigate(['main-menu/quick-game/pvp/game-screen/play'], { queryParams: {gameData: JSON.stringify(this.gameData)}})
      } else{
        this.router.navigate(['main-menu/quick-game/tvt/game-screen/play'], { queryParams: {gameData: JSON.stringify(this.gameData)}})
      }   
    } 
  } 

  private findWinner() : string{
    let winner : string = ""
    
    if(this.isThereAPoint()) return winner
    else{
      const score = this.score1 - this.score2

      switch(score){
        case 0: {
          winner = "No Winner"
          break;
        }
        default: {
          if (score > 0) {
            winner = this.participant1!
          } else {
            winner = this.participant2!
          }
          break; 
      }

    }
      
      return winner
    }
  }


    private isThereAPoint() : boolean {

      let questionX3: number = 4
      let questionX1: number = 4
      let questionsX2: number = 10 
      let questionsLeft : number = 18;
      let pointsTakenOrLost : number = 0;
      const totalPoints : number = 36
      const distance : number = Math.abs(this.score1 - this.score2) 
      
      this.gameData!.questions.forEach(q => {
        questionsLeft--
        pointsTakenOrLost += q.difficultyId

        switch(q.difficultyId){
          case 3: {
            questionX3--
            break
          }
          case 2:{
            questionsX2--
            break
          }
          case 1:{
            questionX1--
            break
          }
        }
      })

      const pointsLeft : number = totalPoints - pointsTakenOrLost
    
      if (questionsLeft === 0) return false
      if(distance === 0) return true      
      if (pointsLeft > distance && questionsLeft >= 2) return true

      const whoWins : number = (this.score1 > this.score2) ? 1 : 2
           
      let maxQuestionLeft: number = (questionX3 > 0) ? 3 : 2
      
      if(questionsX2 === 0 && questionX3 === 0) maxQuestionLeft = 1

       switch(whoWins){
        case 1:{
          switch(this.gameData!.whoPlays){
            case 1:{
              if(pointsLeft > distance) return false             
              break
            }
            case 2:{
              if(pointsLeft > distance) return true
              break
            }            
          }
          if(distance >= pointsLeft){
            if(!this.gameData!.participant2X2 && distance <= pointsLeft + maxQuestionLeft) return true
            return false
          }
          break;
        }
        case 2: {
          switch(this.gameData!.whoPlays){
            case 1:{
              if(pointsLeft > distance) return true
              break
            }
            case 2:{
              if(pointsLeft > distance) return false
              break;
            }            
          }
          if(distance >= pointsLeft){
            if(!this.gameData!.participant1X2 && distance <= pointsLeft + maxQuestionLeft) return true
            return false
          }
          break;
        }
      }
      return false
  }


  back(){
    this.router.navigate(['main-menu'])
  }
}

  


