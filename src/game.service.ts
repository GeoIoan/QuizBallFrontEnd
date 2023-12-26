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

/**
 * Innstances of this class can be used
 * to make requests concerning the game
 * entity to the back-end server.
 */
export class GameService{
    constructor(private http: HttpClient = inject(HttpClient), private auth: AuthService) { }

    /**
     * This method is used to send a request concerning
     * the creation of a new game registry.
     * @param game (Game) Contains the data needed to complete this operation
     * @returns (Observable<any>) the response to the request
     */
    createGame(game: Game): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.post('https://localhost:7053/api/games/CreateGame', game, { headers });
      }

      /**
       * This method is used to send a request concerning 
       * the creation of a relationship between the game
       * and the questions asked during the game
       * @param dto (AddQuestionsDTO) Contains the data needed to complete this operation
       * @returns (Observable<any>) the response to the request
       */
    addQuestionsToGame(dto : AddQuestionsDto) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.post('https://localhost:7053/api/games/AddQuestionsToGame', dto , { headers })
    }

    /**
     * This method is used to send a request concerning 
     * the creation of a relationship between the game
     * and the two participants.
     * @param dto (AddParticipantsToGameDTO) Contains the data needed to complete this operation
     * @returns (Observable<any>) the response to the request
     */
    addParticipantsToGame(dto : AddParticipantsToGame) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.post('https://localhost:7053/api/games/AddParticipantsToGame', dto , { headers })
    }

    endGame(game: GamesEnd) : Observable<any>{
        return this.http.put('https://localhost:7053/api/games', game)
    }

    /**
     * This method is used to send a request that fetces
     * all the games that have a relationship with
     * two specific participants.
     * @param dto (GameByParticipants) Contains the data needed to complete this operation
     * @returns (Observable<any>) the response to the request
     */
    getGameByParticipants(dto: GameByParticipants) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        const params = new HttpParams({ fromObject: dto as any });
        return this.http.get('https://localhost:7053/api/games', { params, headers } )
    }
}