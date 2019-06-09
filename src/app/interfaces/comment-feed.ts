import { UserMinimal } from '@app/interfaces/user-minimal';

/**
 * Represents comment data structure of entry from feed
 */
export interface CommentFeed {
  id: string;
  user: UserMinimal;
  comment: string;
  created: string;
  updated: string;
}
