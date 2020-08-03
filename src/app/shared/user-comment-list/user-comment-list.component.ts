import { Component, Input } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { User } from '@app/interfaces/user';
import { CommentMin } from '@app/interfaces/zero/comment-min';
import { ApiService } from '@app/services/api/api.service';
import { UtilService } from '@app/services/util/util.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons/faFileAlt';

@Component({
  selector: 'app-user-comment-list',
  templateUrl: './user-comment-list.component.html',
  styleUrls: ['./user-comment-list.component.scss'],
})
export class UserCommentListComponent {

  readonly faPost: IconDefinition = faFileAlt;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Comment list
   */
  @Input() userComments: CommentMin[];

  /**
   * Next page endpoint
   */
  @Input() next: string;

  /**
   * User detail
   */
  @Input() user: User;

  constructor(private apiService: ApiService,
              public utils: UtilService) {
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
    this.apiService.getEndpoint<CommentMin>(endpoint).subscribe((data: ApiResponse<CommentMin>): void => {
      this.next = data.next;
      this.loading = false;
      data.results.map((comment: CommentMin): void => {
        this.userComments.push(comment);
      });
    });
  }
}
