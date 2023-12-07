import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CategoriesService{
    constructor(private http: HttpClient = inject(HttpClient)) { }

    getCategories(): Observable<any>{
        return this.http.get('https//localhost:7053/api/categories')
    }
}