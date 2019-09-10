import { Environment } from '@app/interfaces/environment';

export const environment: Environment = {
  name: 'local',
  development: true,
  api: {
    v1: 'http://gonevis.local:8000/api/v1/',
    zero: 'http://gonevis.local:8000/api/zero/',
  },
};
