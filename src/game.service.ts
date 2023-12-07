import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from 'src/interfaces/game-interfaces/game';
import { GameByParticipants } from 'src/interfaces/game-interfaces/game-by-participants';
import { GamesEnd } from 'src/interfaces/game-interfaces/games-end';
import { AddQuestionsDto } from './app/add-questions-dto';

@Injectable({
    providedIn: 'root'
})
export class GameService{
    constructor(private http: HttpClient = inject(HttpClient)) { }

    createGame(game: Game): Observable<any> {
        return this.http.post('https://localhost:7053/api/games/CreateGame', game);
      }

    addQuestionsToGame(dto : AddQuestionsDto) : Observable<any>{
        return this.http.post('https://localhost:7053/api/games/AddQuestionsToGame', dto)
    }

    endGame(game: GamesEnd) : Observable<any>{
        return this.http.put('https://localhost:7053/api/games', game)
    }

    getGameByParticipants(dto: GameByParticipants) : Observable<any>{
        const params = new HttpParams({ fromObject: dto as any });
        return this.http.get('https://localhost:7053/api/games', { params })
    }
}