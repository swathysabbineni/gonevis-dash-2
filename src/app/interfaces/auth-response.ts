import { UserAuth } from '@app/interfaces/user-auth';

export interface AuthResponse {
  token: string;
  user: UserAuth;
}
