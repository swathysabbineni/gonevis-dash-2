import { BlogMin } from '@app/interfaces/zero/feed/blog-min';
import { File } from '@app/interfaces/file';
import { UserMinimal } from '@app/interfaces/user-minimal';

export interface Entry {
  id: string;
  site: BlogMin;
  user: UserMinimal;
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
