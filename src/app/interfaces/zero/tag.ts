import { File } from '@app/interfaces/file';

export interface Tag {
  name: string;
  slug: string;
  description: string;
  site: string;
  media: File;
  absolute_uri: string;
}
