import { Routes} from "@angular/router";
import { PlayerOrTeamComponent } from "./main-components/my-participants/player-or-team/player-or-team.component";
import { GameScreenComponent } from "./main-components/game-screen/game-screen.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { QuickgameeMenuComponent } from "./main-components/quick-game/quickgamee-menu/quickgamee-menu.component";
import { ChoosePlayerComponent } from "./player_components/choose-player/choose-player.component";
import { ChooseTeamComponent } from "./team-components/choose-team/choose-team.component";
import { PlayersTeamsComponent } from "./main-components/my-participants/players-teams/players-teams.component";
import { CategoriesComponent } from "./categories/categories.component";
import { QuestionComponent } from "./question/question.component";
import { AccountComponent } from "./account/account.component";
import { ConfirmPasswordComponent } from "./confirm-password/confirm-password.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { CreateQuestionComponent } from "./create-question/create-question.component";
import { QuestionReviewComponent } from "./question-review/question-review.component";
import { CustomGameComponent } from "./custom-game/custom-game.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthGuard } from './auth.guard';



export const routes: Routes = [    


    { path: "", component: LoginComponent },
    { path: "sign-up", component: RegisterComponent},
    { path: "sign-up/log-in", redirectTo:""},
    { path: "sign-up/sign-in", redirectTo:""},
    { path: "main-menu", component: MainMenuComponent, canActivate: [AuthGuard]},
    
    //Quick Game   
    { path: "main-menu/game-screen", component: GameScreenComponent, canActivate: [AuthGuard]},
    { path:"main-menu/quick-game", component: QuickgameeMenuComponent, canActivate: [AuthGuard]},
    { path:"main-menu/quick-game/quick-game-back", redirectTo: "main-menu"},
    {path:"main-menu/quick-game/pvp", component: ChoosePlayerComponent, canActivate: [AuthGuard]},
    {path:"main-menu/quick-game/tvt", component: ChooseTeamComponent, canActivate: [AuthGuard]},
    {path: "main-menu/quick-game/pvp/back", redirectTo: "main-menu/quick-game"},
    {path: "main-menu/quick-game/pvp/game-screen", component: GameScreenComponent, canActivate: [AuthGuard]},
    {path: "main-menu/quick-game/tvt/back", redirectTo: "main-menu/quick-game"},
    {path: "main-menu/quick-game/tvt/game-screen", component: GameScreenComponent, canActivate: [AuthGuard]},
    {path: "main-menu/quick-game/tvt/game-screen/back", redirectTo:"main-menu/quick-game/tvt"},
    {path: "main-menu/quick-game/pvp/game-screen/back", redirectTo:"main-menu/quick-game/pvp"},
    {path: "main-menu/quick-game/tvt/game-screen/play", component: CategoriesComponent, canActivate: [AuthGuard]},
    {path: "main-menu/quick-game/pvp/game-screen/play", component: CategoriesComponent, canActivate: [AuthGuard]},
    {path: "main-menu/quick-game/tvt/game-screen/play/question", component: QuestionComponent},
    {path: "main-menu/quick-game/pvp/game-screen/play/question", component: QuestionComponent},
    {path: "main-menu/quick-game/pvp/game-screen/play/question/result", redirectTo:"main-menu/quick-game/pvp/game-screen"},
    {path: "main-menu/quick-game/tvt/game-screen/play/question/result", redirectTo:"main-menu/quick-game/tvt/game-screen"},


    

    //Players// Teams
    {path: "main-menu/player-or-team", component: PlayerOrTeamComponent, canActivate: [AuthGuard]},
    {path:"main-menu/player-or-team/back", redirectTo: "main-menu"},
    {path:"main-menu/player-or-team/players", component: PlayersTeamsComponent, canActivate: [AuthGuard]},
    {path:"main-menu/player-or-team/teams", component: PlayersTeamsComponent, canActivate: [AuthGuard]},
    {path:"main-menu/player-or-team/players/back", redirectTo: "main-menu/player-or-team"},
    {path:"main-menu/player-or-team/teams/back", redirectTo:"main-menu/player-or-team"},

    //Account
    {path:"main-menu/account", component: AccountComponent, canActivate: [AuthGuard]},
    {path:"main-menu/account/back", redirectTo: "main-menu"},
    {path:"main-menu/account/password", component: ConfirmPasswordComponent, canActivate: [AuthGuard]},
    {path:"main-menu/account/password/back", redirectTo: "main-menu/account"},
    {path:"main-menu/account/password/change-password", component: ChangePasswordComponent, canActivate: [AuthGuard]},
    {path:"main-menu/account/password/change-password/back", redirectTo:"main-menu/account/password"},


    //Custom Game
    { path:"main-menu/custom-game", component: CustomGameComponent, canActivate: [AuthGuard]},
    { path:"main-menu/custom-game/back", redirectTo:"main-menu"},
    { path:"main-menu/custom-game/create", component: CreateQuestionComponent, canActivate: [AuthGuard]},
    { path:"main-menu/custom-game/create/see-question", component: QuestionReviewComponent, canActivate: [AuthGuard]},
    { path:"main-menu/custom-game/create/see-question/back", redirectTo:"main-menu/custom-game/create"},
    { path:"main-menu/custom-game/create/see-question/next", component: CategoriesComponent, canActivate: [AuthGuard]},
    { path:"main-menu/custom-game/create/see-question/next/next-question", redirectTo:"main-menu/custom-game/create"},

    { path: "menu", redirectTo:"main-menu"},
]
