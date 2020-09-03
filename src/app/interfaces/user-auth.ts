import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { Media } from '@app/interfaces/media';
import { UserTour } from '@app/interfaces/user-tour';

export interface UserAuth {
  email: string;
  get_absolute_uri: string;
  has_verified_email: boolean;
  id: string;
  is_active: boolean;
  media: Media;
  name: string;
  privacy: {
    fb_ga_mobile: boolean;
    fb_ga_web: boolean;
    fb_perf_mobile: boolean;
    fb_perf_web: boolean;
  };
  receive_email_notification: boolean;
  sites: BlogMin[];
  tour: UserTour;
  username: string;
}
