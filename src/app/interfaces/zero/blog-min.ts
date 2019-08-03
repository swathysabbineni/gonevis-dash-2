import { File } from '@app/interfaces/file';

export interface BlogMin {
  id: string;
  title: string;
  description: string;
  media: {
    cover_image: File,
    logo: File
  };
  absolute_uri: string;
}
