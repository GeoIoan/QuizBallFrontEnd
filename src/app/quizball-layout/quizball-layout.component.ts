import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerOrTeamComponent } from '../main-components/my-participants/player-or-team/player-or-team.component';
import { GameScreenComponent } from '../main-components/game-screen/game-screen.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-quizball-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quizball-layout.component.html',
  styleUrls: ['./quizball-layout.component.css']
})
export class QuizballLayoutComponent {

  constructor(private authSer: AuthService, private router: Router){}

  logout(){
    this.authSer.removeGmEmail()
    this.authSer.removeGmId()
    this.authSer.removeGmName()
    this.authSer.removeToken()

    this.router.navigate(["/"])
  }
}
