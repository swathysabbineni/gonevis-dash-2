import { UserMin } from '@app/interfaces/user-min';

export interface Comment {
  id: string;
  user?: UserMin;
  guest_name?: string;
  is_voted: boolean;
  comment: string;
  created: string;
  updated: string;
}
