import { Injectable, ErrorHandler } from '@angular/core';
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
    });
  }

  /**
   * Captures an exception event and sends it to Sentry
   */
  handleError(error): void {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
}
