import { Blog } from '@app/interfaces/zero/blog';
import { Entry } from '@app/interfaces/zero/entry';

export interface Comment {
  id: string;
  comment: string;
  entry: Entry;
  site: Blog;
  created: string;
}
