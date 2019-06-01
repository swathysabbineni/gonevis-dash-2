import { File } from '@app/interfaces/file';

/**
 * Represents minimal blog structure
 */
export interface BlogMinimal {
  id: string;
  title: string;
  description: string;
  media: {
    cover_image: File,
    logo: File
  };
  absolute_uri: string;
}
