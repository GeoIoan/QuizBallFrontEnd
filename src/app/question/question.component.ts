import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Game } from 'src/interfaces/game-interfaces/game';
import { GameData } from '../game-data';
import { Question } from 'src/interfaces/question-interfaces/question';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})

/**This class contains all the logic of
 * the QuestionComponent which is called
 * when we want to display a question.
 */
export class QuestionComponent {
  gameData: GameData | null | undefined;
  question1: string = "";
  question: Question = {
    question1: "",
    media: null,
    gamemasterId: 0,
    difficultyId: 0,
    categoryId: 0,
    answers: "",
    fiftyFifty: ""
  };
  media: boolean = false;
  top5: boolean = false;
  answer: boolean = false;
  answer1: string = "";
  answer2: string = "";
  answer3: string = "";
  answer4: string = "";
  answer5: string = "";
  hide: boolean = false;
  isChecked1: boolean = false;
  isChecked2: boolean = false;
  isChecked3: boolean = false;
  isChecked4: boolean = false;
  isChecked5: boolean = false;
  showModal: boolean = false;
  counter : number = 0;
  safety: boolean = false;
  hideSafety: boolean = false;
  phone: boolean = false;
  fiftyFifty: boolean = false;
  fiftyFifty2: boolean = false;
  fiftyFiftyContent: string = "";
  showFiftyFiftyOption: boolean = false;
  
  constructor(private route: ActivatedRoute , private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.gameData = params['gameData'] ? JSON.parse(params['gameData']) as GameData : null;
      if(this.gameData)
      console.log("X2: ", this.gameData.x2)
    })
   
    this.route.fragment.subscribe(fragment => {
      console.log('question fragment:', fragment);
      if(fragment){
        const q = JSON.parse(fragment)

        this.question = q
      }
      console.log('question:', this.question);
    });

    if(this.question){
      if(this.question.media != null)
      this.media = true
      console.log("media: ",this.media)

      if(this.question.fiftyFifty) this.showFiftyFiftyOption = true;

      if(this.question.categoryId)
        if(this.question.categoryId === 3){
          this.hide = true;
          this.top5 = true
          console.log("top5: ", this.top5)
          
        }     
        // if(this.question.question1){         
        //   if (!this.top5){
        //     const parsedQuestion = JSON.parse(this.question.question1);
        //     this.question1 = parsedQuestion.question;
        //     this.fiftyFiftyContent = parsedQuestion.fiftyFifty;
        //   }          
        // }
    }

      if(this.top5){
        const answer = this.question.answers;
      
        const parsedAnswer = JSON.parse(answer);
        console.log(parsedAnswer)

        this.answer1 = parsedAnswer[1];
        this.answer2 = parsedAnswer[2];
        this.answer3 = parsedAnswer[3];
        this.answer4 = parsedAnswer[4];
        this.answer5 = parsedAnswer[5];
      } 

      if(this.gameData){
        if (this.gameData.whoPlays === 1){
          switch(this.gameData.phone_P1){
            case true: {
              this.phone = true;
              break;
            }            
          }

        switch(this.gameData.fiftyFifty_P1){
          case true: {
            this.fiftyFifty = true;
            break;
          }            
        }
        } else{
          switch(this.gameData.phone_P2){
            case true: {
              this.phone = true;
              break;
            }            
          }
          switch(this.gameData.fiftyFifty_P2){
            case true: {
              this.fiftyFifty = true;
              break;
            }            
          }
        }
      }
   }

   /**
    * This method is called if the participants
    * answer to the question is right. The method
    * forwards the data needed so that the new score 
    * can be calculated in the game-screen component.
    */
  isRight(){
    if (this.gameData){
      this.gameData.rightOrWrong = true
      this.gameData.dif = this.question.difficultyId

      if (this.gameData.game.type == "pvp"){
      console.log("question game data: ", this.gameData)
      this.router.navigate(["main-menu/quick-game/pvp/game-screen/play/question/result"],
        {queryParams: {gameData: JSON.stringify(this.gameData)}})
      }else{
      console.log("question game data: ", this.gameData)
        this.router.navigate(['main-menu/quick-game/tvt/game-screen/play/question/result'],
        {queryParams: {gameData: JSON.stringify(this.gameData)}})
      }
    }
  } 

    /**
    * This method is called if the participants
    * answer to the question is wrong. The method
    * forwards the data needed so that the new score 
    * can be calculated in the game-screen component.
    */
    isWrong(){
      if (this.gameData && this.question){
        this.gameData.rightOrWrong = false
        this.gameData.dif = this.question.difficultyId
  
        if (this.gameData.game.type == "pvp")
        this.router.navigate(["main-menu/quick-game/pvp/game-screen/play/question/result"],
          {queryParams: {gameData: JSON.stringify(this.gameData)}})
          else
          this.router.navigate(["main-menu/quick-game/pvp/game-screen/play/question/result"],
          {queryParams: {gameData: JSON.stringify(this.gameData)}})
        }
      } 

      /**
       * This method is called whenever
       * the gamemaster wants to remember
       * the answer to the question that 
       * was asked.
       */
      showAnswer(){
        this.answer = true
      }

      /**
       * This method is called to
       * hide the answer.
       */
      hideAnswer(){
        this.answer = false
      }

      /**
       * This method is only used when 
       * the questions categoryId = 3 which
       * means that the questions belongs
       * to the top5 category. In these type of
       * questions the participant must find provide
       * 5 answers after, the user gets 6 tries totally.
       * After each try the ready button is clicked and this
       * method is called.
       */
      ready(){
        this.counter++;
        let rightAnswers = 0;

        const checks : boolean[] = [this.isChecked1, this.isChecked2,
                                    this.isChecked3, this.isChecked4,
                                    this.isChecked5]
                         
       

        for (let i : number = 0; i < 5; i++){
                if(checks[i]) rightAnswers++;
              }

        console.log(rightAnswers);

        if(rightAnswers < this.counter){
          this.hideSafety = true;
        }

       if (this.counter > 4 && rightAnswers === 5){
          if(this.gameData){
            this.gameData.dif = this.question.difficultyId
            this.gameData.rightOrWrong = true;
          if (this.gameData.game.type == "pvp"){
            console.log("question game data: ", this.gameData)
            this.router.navigate(["main-menu/quick-game/pvp/game-screen/play/question/result"],
              {queryParams: {gameData: JSON.stringify(this.gameData)}})
            }else{
            console.log("question game data: ", this.gameData)
              this.router.navigate(['main-menu/quick-game/tvt/game-screen/play/question/result'],
              {queryParams: {gameData: JSON.stringify(this.gameData)}})
            }
          }
        } else if (this.counter === 3 && rightAnswers === 3 && !this.safety){
            this.showModal = true;
        }else if (this.counter === 4 && rightAnswers === 3 && !this.safety){
          this.showModal = true;
        }else if (this.counter > 5 && rightAnswers < 5){
          if(this.gameData){
            this.gameData.dif = this.question.difficultyId
          if (this.gameData.game.type == "pvp"){
              console.log("question game data: ", this.gameData)
              this.router.navigate(["main-menu/quick-game/pvp/game-screen/play/question/result"],
              {queryParams: {gameData: JSON.stringify(this.gameData)}})
            }else{
              console.log("question game data: ", this.gameData)
              this.router.navigate(['main-menu/quick-game/tvt/game-screen/play/question/result'],
              {queryParams: {gameData: JSON.stringify(this.gameData)}})
            }
          }
        }       
      }

      
      /**
       * This method is only used when 
       * the questions categoryId = 3 which
       * means that the questions belongs
       * to the top5 category. In these type of
       * questions the participant must find provide
       * 5 answers after, the participant gets 6 tries totally.
       * When the participant gets 3 right answers they
       * are given the option to stop and get 1 point.
       * When this happens, a modal is shown asking
       * players what they want to do. If they choose
       * to stop this method is called.
       */
      stop(){
        if(this.gameData){
          this.gameData.pointx1 = true;
          this.gameData.rightOrWrong = true;
        if (this.gameData.game.type == "pvp"){
          console.log("question game data: ", this.gameData)
          this.router.navigate(["main-menu/quick-game/pvp/game-screen/play/question/result"],
            {queryParams: {gameData: JSON.stringify(this.gameData)}})
          }else{
          console.log("question game data: ", this.gameData)
            this.router.navigate(['main-menu/quick-game/tvt/game-screen/play/question/result'],
            {queryParams: {gameData: JSON.stringify(this.gameData)}})
          }
        }

        this.showModal = false;
      }


       /**
       * This method is only used when 
       * the questions categoryId = 3 which
       * means that the questions belongs
       * to the top5 category. In these type of
       * questions the participant must find provide
       * 5 answers after, the participant gets 6 tries totally.
       * When the participant gets 3 right answers they
       * are given the option to stop and get 1 point.
       * When this happens, a modal is shown asking
       * players what they want to do. If they choose
       * to continue this method is called.
       */
      continue(){
        this.showModal = false;   
        this.safety = true;   
      }

      /**
       * This method is called when the 
       * participant chooses to use
       * phone help to answer the question.
       */
      phoneHelp(){
        this.phone = true;

        if(this.gameData){
          if(this.gameData.whoPlays === 1){
            this.gameData.phone_P1 = true;
          }else this.gameData.phone_P2 = true;
        }
      }
    
        /**
       * This method is called when the 
       * participant chooses to use
       * 50-50 help to answer the question.
       * The participant is given two possible 
       * answers to question asked with one of them
       * beaing the right one. If the participants
       * choose right they get one point.
       */
      fiftyFiftyEv(){
        this.fiftyFifty = true;
        this.fiftyFifty2 = true;


        if(this.gameData){
          if(this.gameData.whoPlays === 1){
            this.gameData.fiftyFifty_P1 = true;
            this.gameData.pointx1 = true;
          }else {
            this.gameData.fiftyFifty_P2 = true;
            this.gameData.pointx1 = true;
          }
        }
      }
  }

