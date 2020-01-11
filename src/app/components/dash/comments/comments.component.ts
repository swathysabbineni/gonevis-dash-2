import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommentStatus } from '@app/enums/comment-status';
import { ApiResponse } from '@app/interfaces/api-response';
import { Pagination } from '@app/interfaces/pagination';
import { Comment } from '@app/interfaces/v1/comment';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { TranslateService } from '@ngx-translate/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ToastrService } from 'ngx-toastr';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnDestroy {

  /**
   * Status to choice situation comment
   */
  status = CommentStatus;

  readonly ellipsis: IconDefinition = faEllipsisV;

  /**
   * Current search text
   */
  search: string;

  /**
   * List of comments
   */
  comments: Comment[];

  /**
   * API pagination data
   */
  pagination: Pagination = {
    itemsPerPage: CommentsService.PAGE_SIZE,
    totalItems: 0,
    currentPage: 1,
  };

  /**
   * API loading indicator
   */
  loading = false;

  constructor(private commentsService: CommentsService,
              private translate: TranslateService,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    BlogService.blog.pipe(untilComponentDestroyed(this)).subscribe((blog: BlogMin): void => {
      if (blog) {
        /**
         * Get comments
         */
        this.getComments();
      }
    });
  }

  /**
   * Get comments
   *
   * @param page Page number
   */
  getComments(page: number = 1): void {
    this.pagination.currentPage = page;
    this.loading = true;
    this.commentsService.getComments({
      search: this.search || '',
    }, page).subscribe((response: ApiResponse<Comment>): void => {
      this.pagination.totalItems = response.count;
      this.comments = response.results;
      this.loading = false;
    });
  }

  /**
   * Set comment status
   *
   * @param comment Comment to update
   * @param status Status to set
   */
  update(comment: Comment, status: CommentStatus): void {
    if (comment.status === status) {
      return;
    }
    comment.loading = true;
    comment.status = status;
    this.commentsService.updateComment(comment.id, { status }).subscribe((data: Comment): void => {
      comment.loading = false;
      comment.status = data.status;
    });
  }

  /**
   * Delete a comment
   *
   * @param comment Comment to delete
   */
  delete(comment: Comment): void {
    if (!confirm(this.translate.instant('CONFORM_DELETE_COMMENT'))) {
      return;
    }
    comment.loading = true;
    this.commentsService.deleteComment(comment.id).subscribe((): void => {
      this.toast.info(this.translate.instant('TOAST_DELETE'), this.translate.instant('COMMENT'));
      this.comments.splice(this.comments.indexOf(comment), 1);
    });
  }

  ngOnDestroy(): void {
  }
}
