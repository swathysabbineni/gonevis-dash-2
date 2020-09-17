import { Environment } from '@app/interfaces/environment';
import { VERSION } from 'src/environments/version';

export const environment: Environment = {
  version: VERSION,
  name: 'production',
  development: false,
  api: {
    v1: 'https://www.gonevis.com/api/v1/',
    zero: 'https://www.gonevis.com/api/zero/',
  },
  paymentPublicId: 'pk_05c99b78fc3af3c7338276d58b74e',
  googleAnalytics: 'UA-58251754-3',
  sentry: 'https://b8e92571fb7741a0a6bcae8d6338fc42@sentry.io/1886804',
  cookieDomain: '.gonevis.com',
  firebase: {
    apiKey: 'AIzaSyCBRZfnZkP7-nzjSamfvh-Acz1W2LihdFc',
    authDomain: 'gonevis-com.firebaseapp.com',
    databaseURL: 'https://gonevis-com.firebaseio.com',
    projectId: 'gonevis-com',
    storageBucket: 'gonevis-com.appspot.com',
    messagingSenderId: '366990068291',
    appId: '1:366990068291:web:ede9723c4ee58e4ada22f6',
    measurementId: 'G-WJ7VERR525',
  },
};
