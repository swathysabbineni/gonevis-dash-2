import { Media } from '@app/interfaces/media';

export interface SubscriberUser {
  id: string;
  username: string;
  name: string;
  get_absolute_uri: string;
  media: Media;
}
