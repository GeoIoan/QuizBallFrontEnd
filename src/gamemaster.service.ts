import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Gamemaster } from 'src/interfaces/gamemaster-interfaces/gamemaster';
import { Login } from 'src/interfaces/gamemaster-interfaces/login';
import { GmUpdateDto } from './app/gm-update-dto';
import { AuthService } from './app/auth-service';
import { ChangeGmPassDto } from './app/change-gm-pass-dto';
import { CheckGmPassDto } from './app/check-gm-pass-dto';

@Injectable({
    providedIn: 'root'
})
export class GamemasterService{
  constructor(private http: HttpClient = inject(HttpClient), private auth: AuthService) { }

    headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
    
    
    login(loginDTO: Login): Observable<any> {
        return this.http.post('https://localhost:7053/api/gamemasters/login', loginDTO);
      }

    register(gamemaster: Gamemaster): Observable<any> {
        return this.http.post('https://localhost:7053/api/gamemasters/register', gamemaster);
      }

    deleteGamemaster(id: Number): Observable<any>{
      const headers = this.headers
      return this.http.delete(`https://localhost:7053/api/gamemasters/${id}`, { headers })
    }

    update(dto : GmUpdateDto, id : number): Observable<any>{
      const headers = this.headers
      return this.http.put(`https://localhost:7053/api/gamemasters/${id}`, dto, { headers })
    }

    checkPass(dto: CheckGmPassDto) : Observable<any>{
      const headers = this.headers
      return this.http.post('https://localhost:7053/api/gamemasters/checkPass', dto, { headers })
    }

    changePass(id: number, dto : ChangeGmPassDto) : Observable<any>{
      const headers = this.headers
      return this.http.put(`https://localhost:7053/api/gamemasters/changePass/${id}`, dto, { headers })
    }
}