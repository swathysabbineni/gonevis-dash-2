import { Media } from '@app/interfaces/media';

export interface Blog {
  absolute_uri: string;
  cover_image: Media;
  description: string;
  followers_count: number;
  id: string;
  is_following: boolean;
  logo: Media;
  nsfw: boolean;
  title: string;
  user: {
    media: Media
    name: string;
    username: string;
  };
}
