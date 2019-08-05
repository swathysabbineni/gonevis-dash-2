import { BlogMinimalFeed } from '@app/interfaces/blog-minimal-feed';
import { File } from '@app/interfaces/file';
import { UserMin } from '@app/interfaces/user-min';

/**
 * Represents feed entry structure
 */
export interface EntryFeed {
  id: string;
  site: BlogMinimalFeed;
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
