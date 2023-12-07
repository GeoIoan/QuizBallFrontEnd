import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant } from 'src/interfaces/participant-interfaces/participant';
import { ParticipantsName } from 'src/interfaces/participant-interfaces/participants-name';

@Injectable({
    providedIn: 'root'
})
export class ParticipantService{
    constructor(private http: HttpClient = inject(HttpClient)) {    
    }

    createParticipant(participant: Participant) : Observable<any>{
        return this.http.post("https://localhost:7053/api/participants",participant)
    }

    changeName(dto : ParticipantsName, id : number) : Observable<any>{
        return this.http.put(`https://localhost:7053/api/participants/${id}`, dto)
    }

    getParticipantByType(id : Number, type : string) : Observable<any>{
        return this.http.get(`https://localhost:7053/api/participants/${id}/${type}`)
    }
       deleteParticipant(id : number) : Observable<any> {
        return this.http.delete(`https://localhost:7053/api/participants/${id}`)
    }
}