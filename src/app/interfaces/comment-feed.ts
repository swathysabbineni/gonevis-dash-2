import { UserMinimal } from '@app/interfaces/user-minimal';

/**
 * Represents feed comment structure
 */
export interface CommentFeed {
  comment: string;
  created: Date;
  id: string;
  updated: Date;
  user: UserMinimal;
}
