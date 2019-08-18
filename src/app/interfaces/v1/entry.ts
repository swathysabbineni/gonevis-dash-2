import { Media } from '@app/interfaces/media';
import { TagMin } from '@app/interfaces/v1/tag-min';
import { UserMin } from '@app/interfaces/v1/user-min';

export interface Entry {
  id: string;
  tags: TagMin[];
  media: {
    cover_image: Media;
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
  status: number;
  format: number;
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
}
