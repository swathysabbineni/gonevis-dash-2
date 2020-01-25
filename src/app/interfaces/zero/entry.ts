import { EntryFormat } from '@app/enums/entry-format.enum';
import { File } from '@app/interfaces/file';
import { UserMin } from '@app/interfaces/user-min';
import { BlogMin } from '@app/interfaces/zero/feed/blog-min';

export interface Entry {
  id: string;
  site: BlogMin;
  user: UserMin;
  title: string;
  content: string;
  excerpt: string;
  format: EntryFormat;
  media: {
    cover_image: File
  };
  absolute_uri: string;
  active_comment_count: number;
  can_comment: boolean;
  published: string;
  is_bookmarked: boolean;
  is_voted: boolean;
  featured: boolean;
  vote_count: number;
  view_count: number;

  loading?: boolean;
}
