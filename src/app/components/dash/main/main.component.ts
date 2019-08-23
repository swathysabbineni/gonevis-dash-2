import { Component, OnInit } from '@angular/core';
import { CommentsService } from '@app/components/dash/comments/comments.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { Comment } from '@app/interfaces/v1/comment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  /**
   * List of comments
   */
  comments: Comment[];

  /**
   * Comments count
   */
  commentsCount = 0;

  constructor(private commentsService: CommentsService) {
  }

  ngOnInit(): void {
    /**
     * Get comments
     */
    this.commentsService.getComments().subscribe((response: ApiResponse<Comment>): void => {
      this.comments = response.results;
      this.commentsCount = response.count;
    });
  }
}
