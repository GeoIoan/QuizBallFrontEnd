import { Injectable, Type } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable({
    providedIn: 'root'
})

/**
 * Contains one method that provides
 * authoriztion functionality.
 */
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * This method is used to check if the gamemaster
   * is authenticated, so that we can authorize entry
   * to the static pages of our app.
   * @param component (Type<any>) The component that a gamemaster wants to access
   * @returns (Observable<boolean>) true if authorized false if not
   */
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