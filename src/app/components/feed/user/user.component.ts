import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { UserService } from '@app/components/feed/user/user.service';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { User } from '@app/interfaces/user';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { UtilService } from '@app/services/util/util.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * User detail
   */
  user: User;

  /**
   * List of entries
   */
  entries: EntryFeed[];

  /**
   * Next page endpoint
   */
  next: string;

  /**
   * API errors
   */
  errors: ApiError = {};

  constructor(public utils: UtilService,
              private route: ActivatedRoute,
              private userService: UserService,
              private feedService: FeedService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params: Params): void => {
      this.userService.getUser(params.username).subscribe((data: User): void => {
        this.user = data;
        /**
         * Get entries of this user
         */
        this.feedService.getEntries('', params.username).subscribe((entries: ApiResponse<EntryFeed>): void => {
          this.next = entries.next;
          this.entries = entries.results;
          this.loading = false;
        }, (error: HttpErrorResponseApi): void => {
          this.errors = error.error;
          this.loading = false;
        });
      }, (error: HttpErrorResponseApi): void => {
        this.errors = error.error;
        this.loading = false;
      });
    });
  }
}
