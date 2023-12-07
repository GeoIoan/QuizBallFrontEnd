import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from 'src/interfaces/question-interfaces/question';
import { SelectQuestion } from 'src/interfaces/question-interfaces/select-question';


@Injectable({
    providedIn: 'root'
})
export class QuestionService{
    constructor(private http: HttpClient = inject(HttpClient)) {    
    }

    createQuestion(question : Question) : Observable<any>{
        return this.http.post("https://localhost:7053/api/questions", question)
    }
    
    getRandomQuestion(dto : SelectQuestion): Observable<any> {
        const params = new HttpParams()
          .set('gamemasterId', dto.gamemaster_id!.toString())
          .set('categoryId', dto.category_id.toString())
          .set('difficultyId', dto.difficulty_id.toString());
      
        return this.http.get('https://localhost:7053/api/questions', { params });
      }
      

    getCustomQuestions(id : number) : Observable<any>{
        return this.http.get(`https://localhost:7053/api/questions/${id}`)
    }
}