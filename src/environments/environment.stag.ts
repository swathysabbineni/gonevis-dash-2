import { Environment } from '@app/interfaces/environment';

export const environment: Environment = {
  name: 'staging',
  development: true,
  api: {
    v1: 'http://draft.gonevis.com/api/v1/',
    zero: 'http://draft.gonevis.com/api/zero/',
  },
};
