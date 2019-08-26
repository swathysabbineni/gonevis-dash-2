import { Environment } from '@app/interfaces/environment';
import { environment as environmentProd } from '@environments/environment.prod';

environmentProd.development = false;

export const environment: Environment = environmentProd;
