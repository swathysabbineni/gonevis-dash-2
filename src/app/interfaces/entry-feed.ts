import { BlogMinimal } from '@app/interfaces/blog-minimal';
import { File } from '@app/interfaces/file';
import { Tag } from '@app/interfaces/tag';
import { UserMinimal } from '@app/interfaces/user-minimal';

export interface EntryFeed {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  user: UserMinimal;
  absolute_uri: string;
  tags: Tag[];
  media: {
    cover_image: File
  };
  site: BlogMinimal;
  vote_count: number;
  view_count: number;
  active_comment_count: number;
  comment_enabled: boolean;
  format: number;
  published: Date;
  is_voted: boolean;

  loading?: boolean;
}
