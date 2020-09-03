export interface Environment {
  name: 'production' | 'staging' | 'local' | 'e2e';
  development: boolean;
  api: {
    v1: string;
    zero: string;
  };
  paymentPublicId: string;
  googleAnalytics: string;
  sentry: string;
  cookieDomain: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
}
