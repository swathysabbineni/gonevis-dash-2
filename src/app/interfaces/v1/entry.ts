import { EntryFormat } from '@app/enums/entry-format.enum';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { File } from '@app/interfaces/file';
import { TagMin } from '@app/interfaces/v1/tag-min';
import { UserMin } from '@app/interfaces/v1/user-min';

export interface Entry {
  id: string;
  tags: TagMin[];
  media: {
    cover_image: File;
  };
  absolute_uri: string;
  site: string;
  circles: any[];
  updated_by: UserMin;
  entrydraft?: any;
  vote_count: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  meta_description?: string;
  status: EntryStatus;
  format: EntryFormat;
  comment_enabled: boolean;
  featured: boolean;
  is_page: boolean;
  password: string;
  view_count: number;
  published: string;
  start_publication?: string;
  comment_count: number;
  active_comment_count: number;
  hidden_comment_count: number;
  pending_comment_count: number;
  created: string;
  updated: string;
  user: string;
  /**
   * Extra properties
   */
  loading: boolean;
  select: boolean;
}
