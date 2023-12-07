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
export class PlayerOrTeamComponent {


  constructor(private router: Router) {}

  players(){
    this.router.navigate(['main-menu/player-or-team/players'], { 
      queryParams: {participants : "player"
      }})    
  }

  teams(){
    this.router.navigate(['main-menu/player-or-team/teams'], { 
      queryParams: {participants : "team"
      }})    
  }

}
