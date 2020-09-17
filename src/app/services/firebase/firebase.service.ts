import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { environment } from '@environments/environment';

/** Loading them here because AngularFire imports them dynamically and will be removed in Tree Shaking time. */
import 'firebase/performance';
import 'firebase/analytics';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  constructor(private firebaseApp: FirebaseApp) {
  }

  /**
   * @returns Boolean which determines whether or not Firebase Performance Monitoring is enabled.
   */
  checkPerformanceInLocal(): boolean | null {
    if (localStorage.getItem('fb_perf_web') && typeof JSON.parse(localStorage.getItem('fb_perf_web')) === 'boolean') {
      return JSON.parse(localStorage.getItem('fb_perf_web'));
    }

    return null;
  }

  /**
   * @returns Boolean which determines whether or not Firebase Analytics is enabled.
   */
  checkAnalyticsInLocal(): boolean | null {
    if (localStorage.getItem('fb_ga_web') && typeof JSON.parse(localStorage.getItem('fb_ga_web')) === 'boolean') {
      return JSON.parse(localStorage.getItem('fb_ga_web'));
    }

    return null;
  }

  /**
   * Enable or disable Firebase Performance Monitoring.
   *
   * @param value Whether to enable or disable.
   */
  enablePerformance(value: boolean): void {
    localStorage.setItem('fb_perf_web', String(value));
    // Use Firebase Performance Monitoring only in Production and Staging.
    if (environment.development) {
      return;
    }
    this.firebaseApp.performance().instrumentationEnabled = value;
    this.firebaseApp.performance().dataCollectionEnabled = value;
  }

  /**
   * Enable or disable Firebase Analytics.
   *
   * @param value Whether to enable or disable.
   */
  enableAnalytics(value: boolean): void {
    localStorage.setItem('fb_ga_web', String(value));
    // Use Firebase Analytics only in Production and Staging.
    if (environment.development) {
      return;
    }
    this.firebaseApp.analytics().setAnalyticsCollectionEnabled(value);
  }
}
