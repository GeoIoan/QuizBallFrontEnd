import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Game } from 'src/interfaces/game-interfaces/game';
import { param } from 'jquery';
import { GameData } from 'src/app/game-data';

@Component({
  selector: 'app-quickgamee-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quickgamee-menu.component.html',
  styleUrls: ['./quickgamee-menu.component.css']
})
export class QuickgameeMenuComponent {
  gameData: GameData | null | undefined

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.gameData = params['gameData'] ? JSON.parse(params['gameData']) as GameData : null;
      console.log(this.gameData)
    });
  }

  navigateToPvP(): void {
    if (this.gameData) {
      this.gameData.game.type = "pvp"
      this.router.navigate(['main-menu/quick-game/pvp'], { queryParams: {gameData: JSON.stringify(this.gameData)}})
    }
  }

  navigateToTvT(): void {
    if (this.gameData) {
      this.gameData.game.type = "tvt"
      this.router.navigate(['main-menu/quick-game/tvt'], { queryParams: {gameData: JSON.stringify(this.gameData)}})
    }
  }
}
