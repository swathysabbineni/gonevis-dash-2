import { File } from '@app/interfaces/file';

export interface Blog {
  id: string;
  user: string;
  title: string;
  description: string;
  meta_description: string;
  media: {
    cover_image: File;
    logo: File;
  };
  url: string;
  absolute_uri: string;
  updated: string;
  created: string;
}
