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
