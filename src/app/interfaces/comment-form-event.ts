import { CommentFeed } from '@app/interfaces/comment-feed';

/**
 * Represents comment from emitted event structure
 */
export interface CommentFormEvent {
  comment: CommentFeed;
  isEdit: boolean;
}
