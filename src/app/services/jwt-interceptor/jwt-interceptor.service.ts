import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api/http-error-response-api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  /**
   * @param request The outgoing request to handle
   * @param next The next interceptor in the chain, or the backend if no interceptors in the chain.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string;
    // Get token from token subject.
    token = this.authService.tokenValue;
    // Add authorization header with bearer token if available.
    if (token) {
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
        // Auto logout if 401 response returned from api
        if (error.status === 401) {
          this.authService.unAuth();
        }
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error('Backend returned code:', error.status, 'body was: ', error.error);
      }
      return throwError(new HttpErrorResponseApi(error));
    }));
  }
}
