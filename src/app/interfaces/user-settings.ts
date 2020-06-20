import { UserAuth } from '@app/interfaces/user-auth';

/**
 * Represents user settings data structure
 */
export interface UserSettings extends UserAuth {
  about: string;
  absolute_url: string;
  location: string;
  date_joined: string;
}
