import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { MessageModalComponent } from '@app/shared/message-modal/message-modal.component';
import { environment } from '@environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private cookieService: CookieService,
              private authService: AuthService,
              private modalService: BsModalService) {
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
          if (error.error.non_field_errors && error.error.non_field_errors.includes('Your email is not verified.')) {
            this.modalService.show(MessageModalComponent, {
              initialState: {
                title: 'EMAIL_NOT_VERIFIED',
                messages: [...error.error.non_field_errors, 'TEXT_EMAIL_NOT_VERIFIED'],
              },
              class: 'modal-sm',
            });
          }
          break;
        }
        case 401: {
          /**
           * Don't handle this error for reset-password endpoint
           */
          if (request.url.endsWith('password-reset/')) {
            break;
          }
          /**
           * Check if modal has already been opened
           */
          if (!AuthService.preventInvalidAuthenticationModal) {
            /**
             * Prevent invalid authentication modal from opening again. (unless user logs-in)
             */
            AuthService.preventInvalidAuthenticationModal = true;
            /**
             * User authentication token is invalid
             */
            this.authService.signOut(false).then((): void => {
              this.modalService.show(MessageModalComponent, {
                initialState: {
                  title: 'INVALID_AUTHENTICATION',
                  messages: ['TEXT_INVALID_AUTHENTICATION'],
                  button: 'OK',
                },
                class: 'modal-sm',
              });
            });
          }
          break;
        }
        case 403: {
          /**
           * User does not have permission for this action
           */
          if (error.error.detail === 'You do not have permission to perform this action.') {
            this.modalService.show(MessageModalComponent, {
              initialState: {
                title: 'UNAUTHORIZED_ACCESS',
                messages: [error.error.detail],
                button: 'OK',
              },
              class: 'modal-sm',
            });
          }
          /**
           * User blog needs to be upgrade for this action
           */
          if (error.error.detail === 'You need to upgrade your subscription plan to make such action.') {
            this.modalService.show(MessageModalComponent, {
              initialState: {
                title: 'LOCKED_FEATURE',
                messages: [error.error.detail],
                button: 'OK',
              },
              class: 'modal-sm',
            });
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
