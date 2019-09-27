import { Component, OnInit } from '@angular/core';
import { CommentStatus } from '@app/enums/comment-status';
import { ApiResponse } from '@app/interfaces/api-response';
import { Comment } from '@app/interfaces/v1/comment';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {

  status = CommentStatus;

  /**
   * List of comments
   */
  comments: Comment[];

  /**
   * API loading indicator
   */
  loading = false;

  constructor(private commentsService: CommentsService,
              private translate: TranslateService,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    BlogService.blog.subscribe((blog: BlogMin): void => {
      if (blog) {
        /**
         * Get comments
         */
        this.commentsService.getComments().subscribe((response: ApiResponse<Comment>): void => {
          this.comments = response.results;
          this.loading = true;
        });
      }
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
}
