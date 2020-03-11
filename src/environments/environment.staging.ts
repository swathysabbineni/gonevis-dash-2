import { Environment } from '@app/interfaces/environment';

export const environment: Environment = {
  name: 'staging',
  development: false,
  api: {
    v1: 'http://draft.gonevis.com/api/v1/',
    zero: 'http://draft.gonevis.com/api/zero/',
  },
  paymentPublicId: 'pk_b2b11892e0e39d3d22a3f303e2690',
  googleAnalytics: '',
  sentry: 'https://b8e92571fb7741a0a6bcae8d6338fc42@sentry.io/1886804',
  cookieDomain: '.draft.gonevis.com',
};
