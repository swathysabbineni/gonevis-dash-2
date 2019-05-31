import { BlogMinimal } from '@app/interfaces/blog-minimal';
import { File } from '@app/interfaces/file';
import { Tag } from '@app/interfaces/tag';
import { UserMinimal } from '@app/interfaces/user-minimal';

export interface EntryFeed {
  absolute_uri: string;
  active_comment_count: number;
  can_comment: boolean;
  content: string;
  id: string;
  is_bookmarked: boolean;
  is_voted: boolean;
  media: {
    cover_image: File
  };
  featured: boolean;
  published: Date;
  site: BlogMinimal;
  title: string;
  user: UserMinimal;
  vote_count: number;
  view_count: number;

  loading?: boolean;
}
