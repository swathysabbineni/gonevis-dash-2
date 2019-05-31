import { File } from '@app/interfaces/file';

/**
 * Represents tag structure
 */
export interface Tag {
  name: string;
  slug: string;
  description: string;
  site: string;
  media: File;
  absolute_uri: string;
}
