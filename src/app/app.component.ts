import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainMenuComponent } from './main-menu/main-menu.component';


import { QuizballLayoutComponent } from './quizball-layout/quizball-layout.component';
import { PlayerOrTeamComponent } from './main-components/my-participants/player-or-team/player-or-team.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,QuizballLayoutComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  name = "Giorgos"
  surname = "Ioannou"
}
