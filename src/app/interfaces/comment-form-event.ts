import { Comment } from '@app/interfaces/comment';

export interface CommentFormEvent {
  comment: Comment;
  isEdit: boolean;
}
