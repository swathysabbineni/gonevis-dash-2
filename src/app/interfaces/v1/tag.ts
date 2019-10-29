import { File } from '@app/interfaces/file';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  meta_description?: any;
  site: string;
  media: {
    cover_image: File;
  };
  tagged_items_count: number;
  absolute_uri: string;
  /**
   * Extra properties
   */
  loading: boolean;
}
