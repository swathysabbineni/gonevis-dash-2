import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ApiError } from '@app/interfaces/api-error';
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
              private authService: AuthService) {
  }

  /**
   * Modify headers and error handling
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /**
     * Add authorization to headers
     */
    const token = this.authService.getToken();
    if (token && request.url.includes(environment.api.v1) || request.url.includes(environment.api.zero)) {
      request = request.clone({
        setHeaders: {
          Authorization: `JWT ${token}`,
        },
      });
    }
    /**
     * Error handling
     */
    return next.handle(request).pipe(catchError((httpErrorResponse: HttpErrorResponse): Observable<never> => {
      /**
       * Convert error response
       */
      const error: HttpErrorResponseApi = new HttpErrorResponseApi(httpErrorResponse);
      /**
       * Handle error status cases
       */
      switch (error.status) {
        case 400: {
          /**
           * User email is not verified
           */
          if (error.error.non_field_errors.includes('Your email is not verified.')) {
            // @todo
          }
          break;
        }
        case 401: {
          /**
           * User authentication token is invalid
           */
          // @todo
          break;
        }
        case 403: {
          /**
           * User does not have permission for this action
           */
          if (error.error.detail === 'You do not have permission to perform this action.') {
            // @todo
          }
          /**
           * User blog needs to be upgrade for this action
           */
          if (error.error.detail === 'You need to upgrade your subscription plan to make such action.') {
            // @todo
          }
          break;
        }
      }
      /**
       * Return the error
       */
      return throwError(error);
    }));
  }
}
