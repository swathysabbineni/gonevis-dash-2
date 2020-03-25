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
}
