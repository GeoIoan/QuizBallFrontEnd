import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from 'src/interfaces/question-interfaces/question';
import { SelectQuestion } from 'src/interfaces/question-interfaces/select-question';
import { AuthService } from './auth-service';


@Injectable({
    providedIn: 'root'
})
export class QuestionService{
    constructor(private http: HttpClient = inject(HttpClient), private auth: AuthService) {    
    }

    createQuestion(question : Question) : Observable<any>{
        return this.http.post("https://localhost:7053/api/questions", question)
    }
    
    getRandomQuestion(dto : SelectQuestion): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', this.auth.getAuthToken()!);
        const params = new HttpParams()
          .set('gamemasterId', dto.gamemaster_id!.toString())
          .set('categoryId', dto.category_id.toString())
          .set('difficultyId', dto.difficulty_id.toString())
          .set('lastQuestion', dto.lastQuestion.toString());
      
        return this.http.get('https://localhost:7053/api/questions', { params, headers });
      }
      

    getCustomQuestions(id : number) : Observable<any>{
        return this.http.get(`https://localhost:7053/api/questions/${id}`)
    }
}