import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant } from 'src/interfaces/participant-interfaces/participant';
import { ParticipantsName } from 'src/interfaces/participant-interfaces/participants-name';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class ParticipantService{
    constructor(private http: HttpClient = inject(HttpClient), private auth: AuthService) {    
    }

    
    createParticipant(participant: Participant) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.post("https://localhost:7053/api/participants",participant, { headers })
    }

    changeName(dto : ParticipantsName, id : number) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.put(`https://localhost:7053/api/participants/${id}`, dto , { headers })
    }

    getParticipantByType(id : Number, type : string) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.get(`https://localhost:7053/api/participants/${id}/${type}`, { headers })
    }
       deleteParticipant(id : number) : Observable<any> {
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.delete(`https://localhost:7053/api/participants/${id}`, { headers })
    }
}