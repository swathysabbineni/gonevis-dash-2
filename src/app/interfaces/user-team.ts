import { Media } from '@app/interfaces/media';

/**
 * Represents team member user data
 */
export interface UserTeam {
  email: string;
  get_absolute_uri: string;
  get_full_name: string;
  media: Media;
  name: string;
  username: string;
  id: string;
}
