import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Game } from 'src/interfaces/game-interfaces/game';
import { Categories } from '../categories';
import { QuestionService } from '../question.service';
import { SelectQuestion } from 'src/interfaces/question-interfaces/select-question';
import { catchError } from 'rxjs';
import { Question } from 'src/interfaces/question-interfaces/question';
import { GameData } from '../game-data';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

/**
 * This class contains all the logic 
 * of the Categories Component which is used
 * whenever a participant must choose a question.
 * To handle that case a card containing all 
 * the available questions is shown and the participants
 * can choose which question they want to answer.
 */
export class CategoriesComponent {
  gameData: GameData | null | undefined;
  participant1: string | null | undefined
  participant2: string | null | undefined
  ifQuickGame: boolean = false
  ifCustomGame: boolean = false
  errorMessage: string = ""
  participant1X2: boolean = false
  participant2X2: boolean = false
  x2 : boolean = false
  whoPlays: number | null | undefined 
  errorContainerIsVisible: boolean = false

  constructor(private questionService: QuestionService ,private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.gameData = params['gameData'] ? JSON.parse(params['gameData']) as GameData : null;
     if(this.gameData) {
        this.whoPlays = this.gameData.whoPlays     
        this.participant1X2 = this.gameData.participant1X2
        this.participant2X2 = this.gameData.participant2X2
        this.participant1 = this.gameData.participant1
        this.participant2 = this.gameData.participant2
      }
    }); 
  }

  /**
   * During initialization the available questions
   * are found and displayed accordingly.
   */
  ngOnInit(): void {   
    if(this.gameData){
      if (this.gameData.game.custom == 0) 
      {
        this.ifQuickGame = true;
      }
      else this.ifCustomGame = true;
      
    
      setTimeout(() =>{ for(let i = 1; i <= 8; i++){
        if(this.gameData)
        for(const dif in this.gameData.categories[i]){
            if(this.gameData.categories[i][dif] == true){
              let elementId: string = `${i},${dif}`;
              
              console.log("elementId: ", elementId)
              
              const element : HTMLElement = document.getElementById(elementId) as HTMLElement;
    
              console.log(element)

              if(element){
                console.log("we are here")
                element.classList.remove('btn-outline-danger')
                element.classList.add('btn-outline-secondary')
              }
            }
      }}}, 0); 
  }
    

    console.log("Game: ", this.gameData)  
    console.log("Who Plays: ", this.whoPlays)
  }


  /**
   * This method handles the case where 
   * the participant chooses the x2 points 
   * option.
   * @returns 
   */
  X2(){   
   if (this.participant1X2 && this.whoPlays == 1) return
   else if (this.participant2X2 && this.whoPlays == 2) return
    
    this.x2 = true
    
    if(this.whoPlays == 1) 
      this.participant1X2 = true          
    else 
      this.participant2X2 = true   
  }

  /**
   * This method fethes a random question
   * of specific category and difficulty level 
   * from the back-end server 
   * @param cat (number) the categories id
   * @param dif (number) the difficulty id
   * @returns 
   */
  getQuestion(cat: number, dif: number): void {
      let lastQuestion : number = 0;

      if(this.gameData){
        if(this.gameData.categories[cat][dif] == true) return
        this.gameData.categories[cat][dif] = true;    
        
        console.log("Cat: ",cat)
        console.log("Dif: ", dif)

        console.log("Questions so far")

        this.gameData.questions.forEach(q => {         
          console.log(q)
          if(q.categoryId == cat && q.difficultyId == Math.floor(dif)) lastQuestion = q.id
        })
      }

      console.log("LastQuestion: ", lastQuestion)

      const dto: SelectQuestion = {
        gamemaster_id: 1,
        category_id: cat,
        difficulty_id: Math.floor(dif),
        lastQuestion: lastQuestion
      }

      this.questionService.getRandomQuestion(dto)
      .pipe(
        catchError(error => {
          if ((error.status == 500 && error.message == "Something went wrong") || error.status == 400) {
            this.errorContainerIsVisible = true
            this.errorMessage = "An unexpected error occurred while getting the question"

             setTimeout(() => {
                  this.errorContainerIsVisible = false;
                }, 3000); 
            if (this.gameData)
            this.gameData.categories![cat][dif] = false; 
          } else {
            this.errorContainerIsVisible = true
            this.errorMessage = "An internal error occurred while getting the question"

            setTimeout(() => {
              this.errorContainerIsVisible = false;
            }, 3000); 
            if (this.gameData)
            this.gameData.categories![cat][dif] = false; 
          }
          return error
        }) 
      )
      .subscribe(q => {
        console.log("Question id: ", q.id)

        if(this.gameData) {

          const question : Question = {
            question1 : q.question1,
            media: q.media,
            answers: q.answers,
            categoryId: q.categoryId,
            difficultyId: q.difficultyId,
            gamemasterId: q.gamemasterId,
            fiftyFifty : q.fiftyFifty
          }

          this.gameData.participant1X2 = this.participant1X2
          this.gameData.participant2X2 = this.participant2X2

          this.gameData.x2 = this.x2

          this.gameData.questions.push(q);
           
          console.log("X2: ", this.gameData.x2)

          if(this.gameData.game.type == "pvp") {
          this.router.navigate(['main-menu/quick-game/pvp/game-screen/play/question'],
          {fragment: JSON.stringify(question), queryParams: {gameData: JSON.stringify(this.gameData)}}) 
          }else{
            this.router.navigate(['main-menu/quick-game/tvt/game-screen/play/question'],
            {fragment: JSON.stringify(question) , queryParams: {gameData: JSON.stringify(this.gameData)}})
          }
     }
    })    
  }
}
