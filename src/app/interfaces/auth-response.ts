import { UserAuth } from '@app/interfaces/user-auth';

/**
 * Represents authenticaton response data structure
 */
export interface AuthResponse {
  token: string;
  user: UserAuth;
}
