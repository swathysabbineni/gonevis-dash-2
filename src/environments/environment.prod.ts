import { Environment } from '@app/interfaces/environment';

export const environment: Environment = {
  name: 'production',
  development: true,
  api: {
    v1: 'https://www.gonevis.com/api/v1/',
    zero: 'https://www.gonevis.com/api/zero/',
  },
};
