import { Media } from '@app/interfaces/media';
import { UserTour } from '@app/interfaces/user-tour';

/**
 * Represents user settings structure
 */
export interface UserSettingsPatch {
  about?: string;
  email?: string;
  get_absolute_uri?: string;
  has_verified_email?: boolean;
  location?: string;
  media?: Media;
  name?: string;
  receive_email_notification?: boolean;
  tour?: UserTour;
  picture?: FormData | null;
}
