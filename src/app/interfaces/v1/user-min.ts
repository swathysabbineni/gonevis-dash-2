import { Media } from '@app/interfaces/media';

export interface UserMin {
  id: string;
  username: string;
  name: string;
  get_absolute_uri: string;
  media: Media;
  /**
   * For data in team
   */
  email?: string;
  get_full_name?: string;
}
