import { BlogMinimal } from '@app/interfaces/blog-minimal';
import { File } from '@app/interfaces/file';
import { Tag } from '@app/interfaces/tag';
import { UserMinimal } from '@app/interfaces/user-minimal';

/**
 * Represents feed entry structure
 */
export interface EntryFeed {
  id: string;
  site: BlogMinimal;
  user: UserMinimal;
  absolute_uri: string;
  active_comment_count: number;
  can_comment: boolean;
  content: string;
  media: {
    cover_image: File
  };
  is_bookmarked: boolean;
  is_voted: boolean;
  featured: boolean;
  published: Date;
  title: string;
  vote_count: number;
  view_count: number;

  loading?: boolean;
}
