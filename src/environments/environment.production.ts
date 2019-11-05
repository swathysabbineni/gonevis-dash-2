import { Environment } from '@app/interfaces/environment';
import { environment as environmentProd } from '@environments/environment.prod';

environmentProd.development = false;
environmentProd.googleAnalytics = 'UA-58251754-3';

export const environment: Environment = environmentProd;
