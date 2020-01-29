import { Environment } from '@app/interfaces/environment';

export const environment: Environment = {
  name: 'production',
  development: true,
  api: {
    v1: 'https://www.gonevis.com/api/v1/',
    zero: 'https://www.gonevis.com/api/zero/',
  },
  paymentPublicId: 'pk_05c99b78fc3af3c7338276d58b74e',
  googleAnalytics: '',
  sentry: 'https://b8e92571fb7741a0a6bcae8d6338fc42@sentry.io/1886804',
};
