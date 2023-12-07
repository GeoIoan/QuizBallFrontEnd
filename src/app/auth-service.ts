import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService{
    constructor(private http: HttpClient = inject(HttpClient)) { }

    private token: string = "token"
    private gmId: string = "gmId"
    private gmName: string = "gmName"
    private gmEmail: string = "gmEmail"

    auth(): Observable<any> {
        console.log("Token: ", this.token)

        const token = this.getAuthToken()

        console.log(token)

        const headers = new HttpHeaders().set('Authorization', `${token?.toString()}`);

        return this.http.get('https://localhost:7053/api/Auth/auth', { headers });
      }

    setAuthToken(token: string): void {
        localStorage.setItem(this.token, token);
      }

    getAuthToken(): string | null {
        return localStorage.getItem(this.token);
    }

    setGmId(id : number) : void {
      localStorage.setItem(this.gmId, id.toString())
    }

    getGmId(): string | null {
        return localStorage.getItem(this.gmId)
    }

    setGmName(name : string) : void {
        localStorage.setItem(this.gmName, name)
    }

    getGmName() : string | null{
      return localStorage.getItem(this.gmName)
    }

    setGmEmail(email : string): void{
        localStorage.setItem(this.gmEmail, email)
    }

    getGmEmail() : string | null{
        return localStorage.getItem(this.gmEmail)
    }

    removeToken() : void {
        localStorage.removeItem(this.token)
    }

    removeGmId() : void {
        localStorage.removeItem(this.gmId)
    }

    removeGmName() : void {
        localStorage.removeItem(this.gmName)
    }

    removeGmEmail() : void {
        localStorage.removeItem(this.gmEmail)
    }
}