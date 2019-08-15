import { Media } from '@app/interfaces/media';

export interface User {
  id: string;
  username: string;
  name: string;
  location: string;
  about: string;
  is_active: boolean;
  date_joined: string;
  updated: string;
  media: Media;
  get_full_name: string;
  get_short_name: string;
  get_absolute_uri: string;
  receive_email_notification: boolean;
  has_verified_email: boolean;
}
