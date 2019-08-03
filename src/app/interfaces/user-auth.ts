import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { Media } from '@app/interfaces/media';
import { UserTour } from '@app/interfaces/user-tour';

/**
 * Represents authenticated user structure
 */
export interface UserAuth {
  email: string;
  get_absolute_uri: string;
  has_verified_email: boolean;
  id: string;
  is_active: boolean;
  media: Media;
  name: string;
  receive_email_notification: boolean;
  sites: BlogMin[];
  tour: UserTour;
  username: string;
}
