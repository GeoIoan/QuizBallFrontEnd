import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant } from 'src/interfaces/participant-interfaces/participant';
import { ParticipantsName } from 'src/interfaces/participant-interfaces/participants-name';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})

/**
 * Instances of this class can be used
 * to make requests concerning the participant
 * entity to the back-end server.
 */
export class ParticipantService{
    constructor(private http: HttpClient = inject(HttpClient), private auth: AuthService) {    
    }

    /**
     * This method is used to send request that
     * concerns the creation of a new participant registry.
     * @param participant (Participant) Contains all the nessecary data needed for this operation.
     * @returns (Observable<any>) the response to the request
     */
    createParticipant(participant: Participant) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.post("https://localhost:7053/api/participants",participant, { headers })
    }

    /**
     * This method is used to send a request
     * in order to change the name of an existing participant.
     * @param dto (ParticipantsName) Contains all the nessecary data needed for this operation.
     * @param id (number) the id of the participant
     * @returns (Observable<any>) the response to the request
     */
    changeName(dto : ParticipantsName, id : number) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.put(`https://localhost:7053/api/participants/${id}`, dto , { headers })
    }

    /**
     * This method is used to send a request
     * in order to get all the participants of
     * a specific type that are related to 
     * a specific gamemaster.
     * @param id (number) the id of the gamemaster
     * @param type (string) the type of the participants
     * @returns (Observable<any>) the response to the request
     */
    getParticipantByType(id : Number, type : string) : Observable<any>{
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.get(`https://localhost:7053/api/participants/${id}/${type}`, { headers })
    }

    /**
     * This method is used to send a request
     * concerning the deletion of a specific participant.
     * @param id (number) the id of the participant
     * @returns (Observable<any>) the response to the request
     */
    deleteParticipant(id : number) : Observable<any> {
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        return this.http.delete(`https://localhost:7053/api/participants/${id}`, { headers })
    }
}