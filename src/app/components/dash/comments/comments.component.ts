import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Comment } from '@app/interfaces/v1/comment';
import { CommentService } from './comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {

  /**
   * List of comments
   */
  comments: Comment[];

  /**
   * API loading indicator
   */
  loading = false;

  constructor(private commentService: CommentService) {
  }

  ngOnInit(): void {
    /**
     * Get comments
     */
    this.commentService.getComments().subscribe((response: ApiResponse<Comment>): void => {
      this.comments = response.results;
      this.loading = true;
    });
  }
}
