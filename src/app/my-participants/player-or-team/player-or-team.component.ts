import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-player-or-team',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './player-or-team.component.html',
  styleUrls: ['./player-or-team.component.css']
})

/**
 * This class contains all the logic
 * of the PlayerOrTeamComponent which is 
 * used when a gamemaster want to view
 * their participants.
 */
export class PlayerOrTeamComponent {

  constructor(private router: Router) {}

  /**
   * This method is called when gamemaster
   * wants to view their players.
   */
  players(){
    this.router.navigate(['main-menu/player-or-team/players'], { 
      queryParams: {participants : "player"
      }})    
  }

  /**
   * This method is called when gamemaster
   * wants to view their teams.
   */
  teams(){
    this.router.navigate(['main-menu/player-or-team/teams'], { 
      queryParams: {participants : "team"
      }})    
  }

}
