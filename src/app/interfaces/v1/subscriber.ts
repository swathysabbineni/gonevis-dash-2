import { Media } from '@app/interfaces/media';

export interface Subscriber {
  username: string;
  name: string;
  media: Media;
  location: string;
  date_joined: string;
  get_absolute_uri: string;
}
