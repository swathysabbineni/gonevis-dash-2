import { Media } from '@app/interfaces/media';

export interface Subscriber {
  username: string;
  name: string;
  media: Media;
  location: string;
  date_joined: Date;
  get_absolute_uri: string;
}
