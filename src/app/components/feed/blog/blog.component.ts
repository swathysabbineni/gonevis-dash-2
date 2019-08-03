import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BlogService } from '@app/components/feed/blog/blog.service';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { Blog } from '@app/interfaces/zero/blog';
import { Entry } from '@app/interfaces/zero/entry';
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
  blog: Blog;

  /**
   * List of entries
   */
  entries: Entry[];

  /**
   * Next page endpoint
   */
  next: string;

  /**
   * API errors
   */
  errors: ApiError = {};

  constructor(private route: ActivatedRoute,
              private blogService: BlogService,
              private feedService: FeedService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params: Params): void => {
      this.blogService.getBlog(params.blogId).subscribe((data: Blog): void => {
        this.blog = data;
        /**
         * Get entries of this blog
         */
        this.feedService.getEntries(params.blogId).subscribe((entries: ApiResponse<Entry>): void => {
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
