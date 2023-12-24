import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PlayerOrTeamComponent } from '../main-components/my-participants/player-or-team/player-or-team.component';
import { GameScreenComponent } from '../../game-screen/game-screen.component';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth-service';
// import { SharedDataService, sharedDataServiceToken } from '../shared.data.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-quizball-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quizball-layout.component.html',
  styleUrls: ['./quizball-layout.component.css']
})
export class QuizballLayoutComponent {
  showLogOut:boolean = true
  logoFunctional: boolean = true
  pageType: string = ""
  currentPath: any;

  constructor(private authSer: AuthService, private router: Router, private route: ActivatedRoute){    
  }
 
  logout(){
    this.authSer.removeGmEmail()
    this.authSer.removeGmId()
    this.authSer.removeGmName()
    this.authSer.removeToken()

    this.router.navigate(["/"])
  }
}
