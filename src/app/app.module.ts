import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFireAnalyticsModule,
  ScreenTrackingService,
  COLLECTION_ENABLED,
  APP_VERSION, APP_NAME,
} from '@angular/fire/analytics';
import {
  AngularFirePerformanceModule,
  PerformanceMonitoringService,
  INSTRUMENTATION_ENABLED,
  DATA_COLLECTION_ENABLED,
} from '@angular/fire/performance';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthInterceptorService } from '@app/services/auth-interceptor/auth-interceptor.service';
import { SentryErrorHandler } from '@app/services/sentry-error-handler/sentry-error-handler.service';
import { UserService } from '@app/services/user/user.service';
import { FeedbackModalModule } from '@app/shared/feedback-modal/feedback-modal.module';
import { MessageModalModule } from '@app/shared/message-modal/message-modal.module';
import { UserAvatarModule } from '@app/shared/user-avatar/user-avatar.module';
import { environment } from '@environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

console.log(`Release ${environment.version.RELEASE_DATE}`);
console.log(`ENV ${environment.name}`);
console.log(`https://github.com/SavandBros/gonevis-dash-2/commit/${environment.version.CIRCLE_SHA1}`);

/**
 * Loads translations from given prefix.
 *
 * @param http Performs HTTP requests.
 *
 * @returns An instance of the loader.
 */
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

// Enables Firebase Performance Monitoring.
let enableFirebasePerformance: boolean;
// Enables Firebase Analytics.
let enableFirebaseAnalytics: boolean;
// Enable or disable Firebase Performance Monitoring and Analytics based on the user's privacy data.
// Disable Firebase Performance Monitoring and Analytics if environment is for testing E2E.
if (environment.development) {
  enableFirebasePerformance = false;
  enableFirebaseAnalytics = false;
} else if (UserService.user && UserService.user.privacy) {
  enableFirebasePerformance = UserService.user.privacy.fb_perf_web;
  enableFirebaseAnalytics = UserService.user.privacy.fb_ga_web;
} else {
  enableFirebasePerformance = true;
  enableFirebaseAnalytics = true;
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    FeedbackModalModule,
    MessageModalModule,
    LoadingBarModule,
    LoadingBarHttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
    }),
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: !environment.development }),
    UserAvatarModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirePerformanceModule,
  ],
  providers: [
    { provide: APP_VERSION, useValue: environment.version.RELEASE_DATE },
    { provide: APP_NAME, useValue: `web-${environment.name}` },
    { provide: COLLECTION_ENABLED, useValue: enableFirebaseAnalytics },
    { provide: DATA_COLLECTION_ENABLED, useValue: enableFirebasePerformance },
    { provide: INSTRUMENTATION_ENABLED, useValue: enableFirebasePerformance },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    PerformanceMonitoringService,
    ScreenTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
