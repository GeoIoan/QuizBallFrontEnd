import { Injectable, Type } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(component: Type<any>): Observable<boolean> {
    return this.authService.auth().pipe(
      map(() => true), 
      catchError((error) => {
        if (error.status === 401) {
          this.router.navigate(['/']);
          return of(false);
        } else {
          throw error;
        }
      })
    );
  }
}