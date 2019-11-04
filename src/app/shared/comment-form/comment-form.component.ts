import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { Comment } from '@app/interfaces/comment';
import { CommentFormEvent } from '@app/interfaces/comment-form-event';
import { UserAuth } from '@app/interfaces/user-auth';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { CommentService } from '@app/services/comment/comment.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
})
export class CommentFormComponent implements AfterViewInit {

  /**
   * Entry ID of the comment
   */
  @Input() entryId: string;

  /**
   * Comment content for both editing and creating comment
   */
  @Input() comment: Comment;

  /**
   * Determine whether can comment on post or not
   */
  @Input() canComment: boolean;

  /**
   * Form submission event
   */
  @Output() formSubmitted: EventEmitter<CommentFormEvent> = new EventEmitter<CommentFormEvent>();

  /**
   * Authenticated user data
   */
  user: UserAuth;

  /**
   * Comment form
   */
  form: FormGroup;

  /**
   * Comment errors
   */
  errors: ApiError = {};

  /**
   * Comment loading indicator
   */
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private commentService: CommentService) {
    /**
     * Get authenticated user data
     */
    AuthService.user.subscribe((data: UserAuth): void => {
      this.user = data;
    });

    // Setup comment form
    this.form = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngAfterViewInit(): void {
    // If editing
    if (this.comment) {
      this.f.comment.setValue(this.comment.comment);
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * @return Change password form controls (fields)
   */
  private get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Comment for the current entry by the current user
   */
  submit(): void {
    this.loading = true;
    // ID required for making API call
    let id: string;
    // Method name to call at CommentService
    let call: string;
    // Check whether user is editing comment or submitting new comment
    if (this.entryId) {
      id = this.entryId;
      call = 'comment';
    } else {
      id = this.comment.id;
      call = 'edit';
    }
    // API call
    this.commentService[call](id, this.f.comment.value).subscribe((data: Comment): void => {
      this.formSubmitted.next({ comment: data, isEdit: call === 'edit' });
      this.f.comment.setValue(call === 'edit' ? data.comment : '');
      this.loading = false;
      this.errors = {};
    }, (error: HttpErrorResponseApi): void => {
      this.loading = false;
      this.errors = error.error;
    });
  }
}
