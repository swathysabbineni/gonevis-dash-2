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
