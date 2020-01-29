import { Environment } from '@app/interfaces/environment';

export const environment: Environment = {
  name: 'local',
  development: true,
  api: {
    v1: 'http://gonevis.local:8000/api/v1/',
    zero: 'http://gonevis.local:8000/api/zero/',
  },
  paymentPublicId: 'pk_b2b6a7bc011e7f2aac971ab51e96a',
  googleAnalytics: '',
  sentry: 'https://b8e92571fb7741a0a6bcae8d6338fc42@sentry.io/1886804',
};
