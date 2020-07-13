import { Environment } from '@app/interfaces/environment';

export const environment: Environment = {
  name: 'e2e',
  development: true,
  api: {
    v1: 'https://draft.gonevis.com/api/v1/',
    zero: 'https://draft.gonevis.com/api/zero/',
  },
  paymentPublicId: 'pk_b2b11892e0e39d3d22a3f303e2690',
  googleAnalytics: '',
  sentry: '',
  cookieDomain: 'localhost',
};
