import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Gamemaster } from 'src/interfaces/gamemaster-interfaces/gamemaster';
import { Login } from 'src/interfaces/gamemaster-interfaces/login';
import { GmUpdateDto } from './interfaces/gamemaster-interfaces/gm-update-dto';
import { AuthService } from './app/auth-service';
import { ChangeGmPassDto } from './interfaces/gamemaster-interfaces/change-gm-pass-dto';
import { CheckGmPassDto } from './interfaces/gamemaster-interfaces/check-gm-pass-dto';

@Injectable({
    providedIn: 'root'
})

/**
 * Innstances of this class can be used
 * to make requests concerning the gamemaster
 * entity to the back-end server.
 */
export class GamemasterService{
  constructor(private http: HttpClient = inject(HttpClient), private auth: AuthService) { }
    
    /**
     * This method is used to send a login request to the
     * back-end server.
     * @param loginDTO (Login) Contains the data needed to complete this operation
     * @returns (Observable<any>) the response to the request
     */
    login(loginDTO: Login): Observable<any> {
        return this.http.post('https://localhost:7053/api/gamemasters/login', loginDTO);
      }


    /**
     * This method is used to send a register request to the
     * back-end server.
     * @param loginDTO (Gamemaster) Contains the data needed to complete this operation
     * @returns (Observable<any>) the response to the request
     */
    register(gamemaster: Gamemaster): Observable<any> {
        return this.http.post('https://localhost:7053/api/gamemasters/register', gamemaster);
      }

    /**
     * This method is used to send a request concerning
     * the deletion of gamemaster registry.
     * @param id (int) the id of the gamemaster.
     * @returns (Observable<any>) the response to the request
     */
    deleteGamemaster(id: Number): Observable<any>{
      const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
      return this.http.delete(`https://localhost:7053/api/gamemasters/${id}`, { headers })
    }

    /**
     * This method is used to send a request concerning
     * the update of an existing gamemaster registry.
     * @param dto (GmUpdateDto) Contains the data needed to complete this operation
     * @param id (int) the id of the gamemaster.
     * @returns (Observable<any>) the response to the request
     */
    update(dto : GmUpdateDto, id : number): Observable<any>{
      const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
      return this.http.put(`https://localhost:7053/api/gamemasters/${id}`, dto, { headers })
    }

    /**
     * This method is used to send a request in order
     * to perfom a passsword check operation.
     * @param dto (CheckGmPassDto) Contains the data needed to complete this operation
     * @returns (Observable<any>) the response to the request
     */
    checkPass(dto: CheckGmPassDto) : Observable<any>{
      const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
      return this.http.post('https://localhost:7053/api/gamemasters/checkPass', dto, { headers })
    }

    /**
     * This method is used to send a request in order
     * to perform a password change operation.
     * @param id (int) the id of the gamemaster
     * @param dto (ChangeGmPassDto) Contains the data needed to complete this operation
     * @returns (Observable<any>) the response to the request
     */
    changePass(id: number, dto : ChangeGmPassDto) : Observable<any>{
      const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
      return this.http.put(`https://localhost:7053/api/gamemasters/changePass/${id}`, dto, { headers })
    }
}