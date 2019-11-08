import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { Comment } from '@app/interfaces/comment';
import { CommentFormEvent } from '@app/interfaces/comment-form-event';
import { UserAuth } from '@app/interfaces/user-auth';
import { Entry } from '@app/interfaces/zero/entry';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { ApiService } from '@app/services/api/api.service';
import { AuthService } from '@app/services/auth/auth.service';
import { CommentService } from '@app/services/comment/comment.service';
import { EntryService } from '@app/services/entry/entry.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faHeart as faHeartFill } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-entry', templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {

  readonly heart: IconDefinition = faHeart;
  readonly heartFill: IconDefinition = faHeartFill;
  readonly edit: IconDefinition = faEdit;
  readonly trash: IconDefinition = faTrash;

  readonly showActionButton = false;

  /**
   * Authenticated user data
   */
  user: UserAuth;

  /**
   * Entry data
   */
  entry: Entry;

  /**
   * Entry comments data
   */
  comments: Comment[] = [];

  /**
   * Highlighted comment ID
   */
  commentHighlighted: string;

  /**
   * Entry load error indicator
   */
  error: boolean;

  /**
   * Next page endpoint for comments
   */
  next: string;

  /**
   * Comment errors
   */
  errors: ApiError = {};

  /**
   * Comment loading indicator
   */
  loading: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private title: Title,
              private translateService: TranslateService,
              private apiService: ApiService,
              private entryService: EntryService,
              private feedService: FeedService,
              private commentService: CommentService) {
  }

  /**
   * Scroll to comment
   */
  private static scrollToComment(): void {
    const element: Element = document.getElementsByClassName('highlighted')[0];
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }

  ngOnInit(): void {
    /**
     * Get authenticated user
     */
    AuthService.user.subscribe((user: UserAuth): void => {
      this.user = user;
    });

    /**
     * Get highlighted comment ID from URL query param
     */
    this.activatedRoute.queryParams.subscribe((params: Params): void => {
      this.commentHighlighted = params.comment;
    });
    /**
     * Get entry ID from URL param
     */
    this.activatedRoute.params.subscribe((params: Params): void => {
      /**
       * Load entry
       */
      this.entryService.getEntry(params.entryId).subscribe((data: Entry): void => {
        this.entry = data;
        /**
         * Set entry title as window title
         */
        this.title.setTitle(`${this.entry.title}${AppComponent.TITLE_SUFFIX}`);
        /**
         * Load entry comments
         */
        this.entryService.getEntryComments(params.entryId).subscribe((comments: ApiResponse<Comment>): void => {
          // Store comments
          this.comments = comments.results;
          // Store next page endpoint for comments
          this.next = comments.next;
          // Watch for view update
          this.changeDetectorRef.detectChanges();
          // If there's highlighted comment in query params
          if (this.commentHighlighted) {
            // FInd highlighted comments in current comment list (page)
            if (this.comments.some((comment: Comment): boolean => comment.id === this.commentHighlighted)) {
              // Scroll to the highlighted comment
              EntryComponent.scrollToComment();
            } else {
              // Get the comment separately since it doesn't exist in the current comment list page
              this.commentService.getComment(params.entryId, this.commentHighlighted).subscribe(
                (comment: Comment): void => {
                  // Add the highlighted comment to the top of the list
                  this.comments.unshift(comment);
                  // Scroll to the highlighted comment
                  EntryComponent.scrollToComment();
                },
              );
            }
          }
        });
      }, (error: HttpErrorResponseApi): void => {
        if (error.status === 404) {
          this.error = true;
        }
      });
    });
  }

  /**
   * Like or unlike comment for user
   *
   * @param comment Comment object
   */
  likeComment(comment: Comment): void {
    this.loading = true;
    this.commentService.like(comment.id).subscribe((data: ApiResponseCreated): void => {
      comment.is_voted = data.created;
      this.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.loading = false;
      this.errors = error.error;
    });
  }

  /**
   * Like or unlike comment for user
   *
   * @param id Commend ID
   * @param index Comment index in list
   */
  removeComment(id: string, index: number): void {
    if (!confirm(this.translateService.instant('REMOVE_COMMENT_PROMPT'))) {
      return;
    }
    this.loading = true;
    this.commentService.remove(id).subscribe((): void => {
      this.comments.splice(index, 1);
      this.loading = false;
    }, (error: HttpErrorResponseApi) => {
      this.loading = false;
      this.errors = error.error;
    });
  }

  /**
   * On comment created/edited
   *
   * @param event Data response
   */
  onCommentSubmit(event: CommentFormEvent): void {
    if (event.isEdit) {
      this.comments.map((comment: Comment): void => {
        if (comment.id === event.comment.id) {
          comment.comment = event.comment.comment;
          comment.updated = event.comment.updated;
        }
      });
    } else {
      this.comments.unshift(event.comment);
      this.entry.active_comment_count++;
    }
  }

  /**
   * Load more
   *
   * @param endpoint Next page endpoint
   */
  loadMore(endpoint: string): void {
    if (!this.next || this.loading) {
      return;
    }
    this.loading = true;
    this.apiService.getEndpoint<Comment>(endpoint).subscribe((data: ApiResponse<Comment>): void => {
      this.next = data.next;
      this.loading = false;
      data.results.map((comment: Comment, index: number): void => {
        if (comment.id === this.commentHighlighted) {
          data.results.splice(index, 1);
          return;
        }
        this.comments.push(comment);
      });
    });
  }
}
