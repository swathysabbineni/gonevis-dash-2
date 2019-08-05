import { BlogMin } from '@app/interfaces/zero/feed/blog-min';
import { File } from '@app/interfaces/file';
import { UserMin } from '@app/interfaces/user-min';

export interface Entry {
  id: string;
  site: BlogMin;
  user: UserMin;
  title: string;
  content: string;
  excerpt: string;
  media: {
    cover_image: File
  };
  absolute_uri: string;
  active_comment_count: number;
  can_comment: boolean;
  published: Date;
  is_bookmarked: boolean;
  is_voted: boolean;
  vote_count: number;
  view_count: number;

  loading?: boolean;
}
