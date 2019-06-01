import { Media } from '@app/interfaces/media';

/**
 * Represents minimal user structure
 */
export interface UserMinimal {
  id: string;
  username: string;
  name: string;
  get_absolute_uri: string;
  media: Media;
}
