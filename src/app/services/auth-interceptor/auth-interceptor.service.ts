import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { environment } from '@environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService, ActiveToast } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private cookieService: CookieService,
              private authService: AuthService,
              private toast: ToastrService) {
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
          if (error.error.detail.indexOf('You do not have permission to perform this action.') !== -1) {
            this.authService.signOut();
          }
          if (error.error.detail.indexOf('You need to upgrade your subscription plan to make such action.') !== -1) {
            /**
             * Find duplicated toast based on message
             */
            const duplicatedToast: ActiveToast<any> = this.toast.findDuplicate(error.error.detail, false, true);
            /**
             * On duplicated toast found, clear the it before showing the message again.
             */
            if (duplicatedToast) {
              this.toast.remove(duplicatedToast.toastId);
            }
            this.toast.error(error.error.detail);
          }
        }
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error('Backend returned code:', error.status, 'body was: ', error.error);
      }
      return throwError(new HttpErrorResponseApi(error));
    }));
  }
}
