import { File } from '@app/interfaces/file';

export interface TagMin {
  id: string;
  name: string;
  slug: string;
  description: string;
  meta_description?: string;
  site: string;
  media: {
    cover_image: File
  };
  tagged_items_count: number;
  absolute_uri: string;
}
