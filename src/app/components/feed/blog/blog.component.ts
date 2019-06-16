import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BlogService } from '@app/components/feed/blog/blog.service';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { BlogFeed } from '@app/interfaces/blog-feed';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Blog detail
   */
  blog: BlogFeed;

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

  constructor(private activatedRoute: ActivatedRoute,
              private blogService: BlogService,
              private feedService: FeedService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.blogService.getBlog(params.blogId).subscribe((data: BlogFeed): void => {
        this.blog = data;

        /**
         * Load entries
         */
        this.feedService.getExploreEntries().subscribe((entries: ApiResponse<EntryFeed>): void => {
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
