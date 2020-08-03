import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { environment } from '@environments/environment';
import * as Sentry from '@sentry/browser';

/**
 * @see https://sentry.io/savand-bros-cx/gonevis-dash/getting-started/javascript-angular/
 */
@Injectable({
  providedIn: 'root',
})
export class SentryErrorHandler implements ErrorHandler {

  static readonly IS_ENABLED = !environment.development;

  constructor() {
    Sentry.init({
      dsn: environment.sentry,
      environment: environment.name,
      enabled: SentryErrorHandler.IS_ENABLED,
      beforeSend(event: Sentry.Event): Sentry.Event {
        try {
          if (event.extra.__serialized__.preventSentryCapture) {
            return null;
          }
        } catch (error) {
        }
        return event;
      },
    });
  }

  /**
   * Captures an exception event and sends it to Sentry
   */
  handleError(error: any | HttpErrorResponseApi): void {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
}
