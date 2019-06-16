import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { CommentFeed } from '@app/interfaces/comment-feed';
import { UserAuth } from '@app/interfaces/user-auth';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { CommentService } from '@app/services/comment/comment.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent {

  /**
   * Authenticated user data
   */
  user: UserAuth;

  /**
   * Comment errors
   */
  errors: ApiError = {};

  /**
   * Comment loading indicator
   */
  loading: boolean;

  /**
   * Entry ID of the comment
   */
  @Input() entryId: string;

  /**
   * Comment ID is required for editing
   */
  @Input() commentId: string;

  /**
   * Comment content for both editing and creating comment
   */
  @Input() commentContent: string;

  /**
   * Form submission event
   */
  @Output() formSubmitted: EventEmitter<CommentFeed> = new EventEmitter<CommentFeed>();

  constructor(private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private authService: AuthService,
              private commentService: CommentService) {
    /**
     * Get authenticated user data
     */
    this.authService.user.subscribe((data: UserAuth): void => {
      this.user = data;
    });
  }

  /**
   * Handle comment submit
   */
  handleSubmit(): void {
    if (this.entryId) {
      this.submit();
    } else {
      this.edit();
    }
  }

  /**
   * Comment for the current entry by the current user
   */
  submit(): void {
    this.loading = true;
    this.commentService.comment(this.entryId, this.commentContent).subscribe((data: CommentFeed): void => {
      this.formSubmitted.next(data);
      this.commentContent = '';
      this.loading = false;
      this.errors = {};
    }, (error: HttpErrorResponseApi): void => {
      this.loading = false;
      this.errors = error.error;
    });
  }

  /**
   * Edit comment
   */
  edit(): void {
    this.loading = true;
    this.commentService.edit(this.commentId, this.commentContent).subscribe((data: CommentFeed): void => {
      this.formSubmitted.next(data);
      this.commentContent = data.comment;
      this.loading = false;
      this.errors = {};
    }, (error: HttpErrorResponseApi): void => {
      this.loading = false;
      this.errors = error.error;
    });
  }
}
