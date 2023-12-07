import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Game } from 'src/interfaces/game-interfaces/game';
import { GameData } from '../game-data';
import { Categories } from '../categories';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

  constructor(private router: Router, private authSer: AuthService) {}

  createGame(): void {
    const newGame: Game = {
      type: null,
      winner: null,
      score: "0:0",
      startdate: null,
      endDate: null,
      duration: null,
      gamemasterId: Number.parseInt(this.authSer.getGmId()!),
      custom: 0,
      participant1Id: null,
      participant2Id: null
    };

    const categories : Categories = {
      1:{
        1: false,
        2: false,
        3: false
      },
      2: {
        1: false,
        2: false,
        3: false
      },
      3: {
        3.1: false,
        3.2: false
      },
      4: {
        3.1: false,
        3.2: false
      },
      5:{
        2.1: false,
        2.2: false
      },
      6:{
        1.1: false,
        1.2: false
      },
      7:{
        1: false,
        2: false
      },
      8:{
        1: false,
        2: false
      },
      9:{
        1.1: false,
        1.2: false
      }
    }

    const gameData : GameData = {
      participant1X2 : false,
      participant2X2 : false,
      game: newGame,
      rightOrWrong : false,
      whoPlays: Math.random() < 0.5 ? 1 : 2,
      round: 1,
      categories : categories,
      wins1: null,
      wins2: null,
      participant1: null,
      participant2: null,
      dif: 1,
      x2: false,
      pointx1: false,
      fiftyFifty_P1: false,
      fiftyFifty_P2: false,
      phone_P1: false,
      phone_P2: false,
      questions: new Array<any>
    }

    console.log('New game data:', gameData);
    this.router.navigate(['main-menu/quick-game'], { queryParams: { gameData: JSON.stringify(gameData) } });
  }
}
