import { Environment } from '@app/interfaces/environment';
import { VERSION } from '@environments/version';

export const environment: Environment = {
  version: VERSION,
  name: 'local',
  development: true,
  api: {
    v1: 'http://gonevis.local:8000/api/v1/',
    zero: 'http://gonevis.local:8000/api/zero/',
  },
  paymentPublicId: 'pk_b2b6a7bc011e7f2aac971ab51e96a',
  googleAnalytics: '',
  sentry: 'https://b8e92571fb7741a0a6bcae8d6338fc42@sentry.io/1886804',
  cookieDomain: '.gonevis.local',
  firebase: {
    apiKey: 'AIzaSyCBRZfnZkP7-nzjSamfvh-Acz1W2LihdFc',
    authDomain: 'gonevis-com.firebaseapp.com',
    databaseURL: 'https://gonevis-com.firebaseio.com',
    projectId: 'gonevis-com',
    storageBucket: 'gonevis-com.appspot.com',
    messagingSenderId: '366990068291',
    appId: '1:366990068291:web:98656b908b17c946da22f6',
    measurementId: 'G-BF3B1399GS',
  },
};
