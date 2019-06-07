import { Media } from '@app/interfaces/media';

/**
 * Represents user settings data structure
 */
export interface UserSettings {
  about: string;
  get_absolute_uri: string;
  get_full_name: string;
  get_short_name: string;
  has_verified_email: boolean;
  id: string;
  is_active: boolean;
  location: string;
  media: Media;
  name: string;
  receive_email_notification: boolean;
  updated: string;
  date_joined: string;
  username: string;
}
