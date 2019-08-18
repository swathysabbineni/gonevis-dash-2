import { Media } from '@app/interfaces/media';

export interface TagMin {
  id: string;
  name: string;
  slug: string;
  description: string;
  meta_description?: string;
  site: string;
  media: Media;
  tagged_items_count: number;
  absolute_uri: string;
}
