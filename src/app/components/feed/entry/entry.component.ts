import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { CommentFeed } from '@app/interfaces/comment-feed';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { UserAuth } from '@app/interfaces/user-auth';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { CommentService } from '@app/services/comment/comment.service';
import { EntryService } from '@app/services/entry/entry.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {

  /**
   * Authenticated user data
   */
  user: UserAuth;

  /**
   * Entry data
   */
  entry: EntryFeed;

  /**
   * Entry comments data
   */
  comments: CommentFeed[] = [];

  /**
   * Entry load error indicator
   */
  error: boolean;

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

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private entryService: EntryService,
              private feedService: FeedService,
              private commentService: CommentService,
              private titleService: Title,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    /**
     * Setup comment form
     */
    this.form = this.formBuilder.group({
      comment: ['', Validators.minLength(3)],
    });
    /**
     * Get authenticated user data
     */
    this.authService.user.subscribe((data: UserAuth): void => {
      this.user = data;
    });
    /**
     * Get entry ID from URL param
     */
    this.activatedRoute.params.subscribe((params: Params): void => {
      /**
       * Load entry
       */
      this.entryService.getEntry(params.entryId).subscribe((data: EntryFeed): void => {
        this.entry = data;
        /**
         * Set entry title as window title
         */
        this.titleService.setTitle(this.entry.title);
      }, (error: HttpErrorResponseApi): void => {
        if (error.status === 404) {
          this.error = true;
        }
      });
      /**
       * Load entry comments
       */
      this.entryService.getEntryComments(params.entryId).subscribe((comments: ApiResponse<CommentFeed>): void => {
        this.comments = comments.results;
      });
    });
  }

  /**
   * Comment for the current entry by the current user
   */
  comment(): void {
    this.loading = true;
    this.commentService.comment(this.entry.id, this.form.controls.comment.value).subscribe((data: CommentFeed) => {
      this.loading = false;
      this.errors = {};
      this.form.reset();
      this.comments.unshift(data);
      this.entry.active_comment_count++;
    }, (error: HttpErrorResponseApi) => {
      this.loading = false;
      this.errors = error.error;
    });
  }

  /**
   * Like or unlike comment for user
   *
   * @param comment Comment object
   */
  likeComment(comment: CommentFeed): void {
    this.loading = true;
    this.commentService.like(comment.id).subscribe((data: ApiResponseCreated) => {
      this.loading = false;
    }, (error: HttpErrorResponseApi) => {
      this.loading = false;
      this.errors = error.error;
    });
  }
}
