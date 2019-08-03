export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  meta_description?: any;
  site: string;
  media: {
    cover_image: {
      id: string;
      file: string;
      thumbnail_256x256: string;
      thumbnail_128x128: string;
      thumbnail_48x48: string;
      ext: string;
      meta_data: {
        description?: any;
        name: string;
      };
      user: string;
      file_name: string;
      size_human: string;
      is_image: boolean;
      created: string;
      updated: string;
    }
  };
  tagged_items_count: number;
  absolute_uri: string;
}
