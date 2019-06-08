import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { CommentFeed } from '@app/interfaces/comment-feed';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { EntryService } from '@app/services/entry/entry.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {

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
   * Entry loading indicator
   */
  loading: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private entryService: EntryService,
              private feedService: FeedService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    /**
     * Get entry ID from URL param
     */
    this.activatedRoute.params.subscribe((params: Params): void => {
      /**
       * Load entry
       */
      this.entryService.getEntry(params.entryId).subscribe((data: EntryFeed): void => {
        this.loading = false;
        this.entry = data;
        /**
         * Set entry title as window title
         */
        this.titleService.setTitle(this.entry.title);
      }, (error: HttpErrorResponseApi): void => {
        this.loading = false;
        if (error.status === 404) {
          this.error = true;
        }
      });
      /**
       * Load entry comments
       */
      this.entryService.getComments(params.entryId).subscribe((comments: ApiResponse<CommentFeed>): void => {
        this.comments = comments.results;
      });
    });
  }

  /**
   * Like or unlike entry for user
   */
  like(): void {
    // Check for loading
    if (this.entry.loading) {
      return;
    }
    this.entry.loading = true;
    // Update like count
    if (this.entry.is_voted) {
      this.entry.vote_count--;
    } else {
      this.entry.vote_count++;
    }
    // Update voted
    this.entry.is_voted = !this.entry.is_voted;
    // API call
    this.feedService.likeEntry(this.entry.id).subscribe((data: ApiResponseCreated): void => {
      this.entry.is_voted = data.created;
      this.entry.loading = false;
    });
  }

  /**
   * Bookmark or un-bookmark entry for user
   */
  bookmark(): void {
    // Check for loading
    if (this.entry.loading) {
      return;
    }
    this.entry.loading = true;
    // Update is bookmarked
    this.entry.is_bookmarked = !this.entry.is_bookmarked;
    // API call
    this.feedService.bookmark(this.entry.id).subscribe((data: ApiResponseCreated): void => {
      this.entry.is_bookmarked = data.created;
      this.entry.loading = false;
    });
  }
}
