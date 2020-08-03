import { Component, Input } from '@angular/core';
import { ObjectType } from '@app/enums/object-type';
import { ApiResponse } from '@app/interfaces/api-response';
import { User } from '@app/interfaces/user';
import { Vote } from '@app/interfaces/zero/vote';
import { ApiService } from '@app/services/api/api.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons/faFileAlt';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';

@Component({
  selector: 'app-user-vote-list',
  templateUrl: './user-vote-list.component.html',
  styleUrls: ['./user-vote-list.component.scss'],
})
export class UserVoteListComponent {

  readonly faLike: IconDefinition = faThumbsUp;
  readonly faPost: IconDefinition = faFileAlt;
  readonly faComment: IconDefinition = faComment;

  readonly objectType = ObjectType;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * List of votes
   */
  @Input() userVotes: Vote[];

  /**
   * Next page endpoint
   */
  @Input() next: string;

  /**
   * User detail
   */
  @Input() user: User;

  constructor(private apiService: ApiService) {
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
    this.apiService.getEndpoint<Vote>(endpoint).subscribe((data: ApiResponse<Vote>): void => {
      this.next = data.next;
      this.loading = false;
      data.results.map((vote: Vote): void => {
        this.userVotes.push(vote);
      });
    });
  }
}
