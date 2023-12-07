import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Game } from 'src/interfaces/game-interfaces/game';
import { ParticipantService } from 'src/app/participant.service';
import { GameData } from 'src/app/game-data';
import { catchError, max } from 'rxjs';
import { GameService } from 'src/game.service';
import { AddQuestionsDto } from 'src/app/add-questions-dto';


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

    const maxQuestion = this.findMaxQuestion()
    if(this.score1 == this.score2 && maxQuestion > 0) return winner
    else if(this.score1 == this.score2 && maxQuestion == 0) winner = "No winner"

    if(maxQuestion == 0)
      if(this.score1 > this.score2)
        if(this.participant1) winner = this.participant1       
      else if (this.score1 < this.score2)
        if(this.participant2) winner = this.participant2
    else {
      let losingScore = 0
      if(this.score1 > this.score2){
        losingScore = this.score2 

        if((losingScore + maxQuestion) < this.score1){
          if(this.participant1)
          winner = this.participant1
        } else return winner
      } else {
        
        losingScore = this.score1 
        
        if((losingScore + maxQuestion) < this.score2){
          if(this.participant2)
          winner = this.participant2
        } else return winner
      }
    }
      
      return winner
    }


    private findMaxQuestion() : number{
      let x3 : boolean = true;
      let x2 : boolean = true;
      let x1: boolean = true
  
    for(let i = 1; i <= 9; i++){
      if (this.gameData){
        if(this.gameData.categories[i]){
          if(this.gameData.categories[i][3] != undefined && this.gameData.categories[i][3] !=null)
          if(!this.gameData.categories[i][3]){
            x3 = this.gameData.categories[i][3]
            break
          }
  
          if(this.gameData.categories[i][3.1] != undefined && this.gameData.categories[i][3.1] !=null)
          if(!this.gameData.categories[i][3.1]){
            x3 = this.gameData.categories[i][3.1]
            break;
          }
          
       if(this.gameData.categories[i][3.2] != undefined && this.gameData.categories[i][3.2] !=null)
          if(!this.gameData.categories[i][3.2]){
            x3 = this.gameData.categories[i][3.2]
            break
          }
                 
          if(this.gameData.categories[i][2] != undefined && this.gameData.categories[i][2] != null)
          if(!this.gameData.categories[i][2]){
            x2 = this.gameData.categories[i][2]
            break
         }

          if(this.gameData.categories[i][2.1] != undefined && this.gameData.categories[i][2.1] !=null)
          if(!this.gameData.categories[i][2.1]){
            x2 = this.gameData.categories[i][2.1] 
            break
          }
  
          if(this.gameData.categories[i][2.2] != undefined && this.gameData.categories[i][2.2] !=null)
          if(!this.gameData.categories[i][2.2]){
            x2 = this.gameData.categories[i][2.2]
            break
          }

          if(this.gameData.categories[i][1] != undefined && this.gameData.categories[i][1] != null)
          if(!this.gameData.categories[i][1]){
            x1 = this.gameData.categories[i][1]
            break
          }
          
          if(this.gameData.categories[i][1.1] != undefined && this.gameData.categories[i][1.1] !=null)
          if(!this.gameData.categories[i][1.1]){
            x1 = this.gameData.categories[i][1.1]
            break
          }
          
          if(this.gameData.categories[i][1.2] != undefined && this.gameData.categories[i][1.2] !=null)
          if(!this.gameData.categories[i][1.2]){
            x1 = this.gameData.categories[i][1.2]
            break
          }
      }
     }
    }
  
    if(!x3) return 3
    if(!x2) return 2
    if(!x1) return 1
    return 0
  }


  back(){
    this.router.navigate(['main-menu'])
  }
}

  


