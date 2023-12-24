import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from 'src/interfaces/game-interfaces/game';
import { GameByParticipants } from 'src/interfaces/game-interfaces/game-by-participants';
import { GamesEnd } from 'src/interfaces/game-interfaces/games-end';
import { AddQuestionsDto } from './interfaces/game-interfaces/add-questions-dto';
import { AddParticipantsToGame } from './interfaces/game-interfaces/add.participants.to.game';
import { AuthService } from './app/auth-service';

@Injectable({
    providedIn: 'root'
})
export class GameService{
    constructor(private http: HttpClient = inject(HttpClient), private auth: AuthService) { }

    createGame(game: Game): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.post('https://localhost:7053/api/games/CreateGame', game, { headers });
      }

    addQuestionsToGame(dto : AddQuestionsDto) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.post('https://localhost:7053/api/games/AddQuestionsToGame', dto , { headers })
    }

    addParticipantsToGame(dto : AddParticipantsToGame) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.post('https://localhost:7053/api/games/AddParticipantsToGame', dto , { headers })
    }

    endGame(game: GamesEnd) : Observable<any>{
        return this.http.put('https://localhost:7053/api/games', game)
    }

    getGameByParticipants(dto: GameByParticipants) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        const params = new HttpParams({ fromObject: dto as any });
        return this.http.get('https://localhost:7053/api/games', { params, headers } )
    }
}