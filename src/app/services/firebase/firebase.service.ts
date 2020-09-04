import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  constructor(private firebaseApp: FirebaseApp) {
  }

  /**
   * @returns Boolean which determines whether or not Firebase Performance Monitoring is enabled.
   */
  localPerformance(): boolean | null {
    if (localStorage.getItem('fb_perf_web') && typeof JSON.parse(localStorage.getItem('fb_perf_web')) === 'boolean') {
      return JSON.parse(localStorage.getItem('fb_perf_web'));
    }

    return null;
  }

  /**
   * @returns Boolean which determines whether or not Firebase Analytics is enabled.
   */
  localAnalytics(): boolean | null {
    if (localStorage.getItem('fb_ga_web') && typeof JSON.parse(localStorage.getItem('fb_ga_web')) === 'boolean') {
      return JSON.parse(localStorage.getItem('fb_ga_web'));
    }

    return null;
  }

  /**
   * Enable or disable Firebase Performance Monitoring.
   *
   * @param value Whether to enable or disable.
   * @param withDelay Determines whether or not to enable/disable with a delay.
   */
  enablePerformance(value: boolean, withDelay?: boolean): void {
    localStorage.setItem('fb_perf_web', String(value));
    // Change value with delay of 400ms.
    if (withDelay) {
      setTimeout((): void => {
        if (this.firebaseApp.performance) {
          this.firebaseApp.performance().instrumentationEnabled = value;
          this.firebaseApp.performance().dataCollectionEnabled = value;
        }
      }, 400);
    } else {
      if (this.firebaseApp.performance) {
        this.firebaseApp.performance().instrumentationEnabled = value;
        this.firebaseApp.performance().dataCollectionEnabled = value;
      }
    }
  }

  /**
   * Enable or disable Firebase Analytics.
   *
   * @param value Whether to enable or disable.
   * @param withDelay Determines whether or not to enable/disable with a delay.
   */
  enableAnalytics(value: boolean, withDelay?: boolean): void {
    localStorage.setItem('fb_ga_web', String(value));
    // Change value with delay of 400ms.
    if (withDelay) {
      setTimeout((): void => {
        if (this.firebaseApp.analytics) {
          this.firebaseApp.analytics().setAnalyticsCollectionEnabled(value);
        }
      }, 400);
    } else {
      if (this.firebaseApp.analytics) {
        this.firebaseApp.analytics().setAnalyticsCollectionEnabled(value);
      }
    }
  }
}
