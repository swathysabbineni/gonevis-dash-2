import { Media } from '@app/interfaces/media';

export interface UserMin {
  id: string;
  name: string;
  email: string;
  username: string;
  media: Media;
  get_full_name: string;
  get_absolute_uri: string;
}
