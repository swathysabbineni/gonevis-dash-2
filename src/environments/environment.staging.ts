import { Environment } from '@app/interfaces/environment';
import { environment as environmentStag } from '@environments/environment.stag';

environmentStag.development = false;

export const environment: Environment = environmentStag;
