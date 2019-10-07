import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { environment } from '@environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private cookieService: CookieService,
              private authService: AuthService) {
  }

  /**
   * @param request The outgoing request to handle
   * @param next The next interceptor in the chain, or the backend if no interceptors in the chain.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.authService.getToken();
    // Add authorization header with bearer token if available.
    if (token && request.url.includes(environment.api.v1) || request.url.includes(environment.api.zero)) {
      request = request.clone({
        setHeaders: {
          Authorization: `JWT ${token}`,
        },
      });
    }
    return next.handle(request).pipe(catchError((error: HttpErrorResponse): Observable<never> => {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // Sign out if 403 response
        if (error.status === 403) {
          this.authService.signOut();
        }
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error('Backend returned code:', error.status, 'body was: ', error.error);
      }
      return throwError(new HttpErrorResponseApi(error));
    }));
  }
}
