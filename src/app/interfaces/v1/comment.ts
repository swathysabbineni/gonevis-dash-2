import { CommentStatus } from '@app/enums/comment-status';
import { ObjectType } from '@app/enums/object-type';
import { UserMin } from '@app/interfaces/v1/user-min';

export interface Comment {
  id: string;
  site: string;
  object_type: number;
  object_pk: ObjectType;
  user: UserMin;
  comment: string;
  status: CommentStatus;
  is_active: boolean;
  is_hidden: boolean;
  needs_approval: boolean;
  commented_object_minimal_data: {
    title: string;
    slug: string;
    id: string;
  };
  updated: string;
  created: string;
  /**
   * Extra properties
   */
  loading: boolean;
}
