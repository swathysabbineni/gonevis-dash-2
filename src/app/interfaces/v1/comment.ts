import { UserMin } from '@app/interfaces/v1/user-min';

export interface Comment {
  id: string;
  site: string;
  object_type: number;
  object_pk: string;
  user: UserMin;
  comment: string;
  status: number;
  is_active: boolean;
  is_hidden: boolean;
  needs_approval: boolean;
  commented_object_minimal_data: {
    title: string;
    slug: string;
    id: string;
  };
  updated: Date;
  created: Date;
}
