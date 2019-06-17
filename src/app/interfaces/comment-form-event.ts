import { CommentFeed } from '@app/interfaces/comment-feed';

export interface CommentFormEvent {
  comment: CommentFeed;
  isEdit: boolean;
}
