import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '@app/components/feed/blog/blog.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { UserAuth } from '@app/interfaces/user-auth';
import { ApiResponseFollow } from '@app/interfaces/v1/api-response-follow';
import { Blog } from '@app/interfaces/zero/blog';
import { ApiService } from '@app/services/api/api.service';
import { AuthService } from '@app/services/auth/auth.service';
import { EntryService } from '@app/services/entry/entry.service';
import { UtilService } from '@app/services/util/util.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Current user
   */
  user: UserAuth;

  /**
   * List of blogs
   */
  @Input() blogs: Blog[];

  /**
   * Next page endpoint
   */
  @Input() next: string;

  constructor(private activatedRoute: ActivatedRoute,
              private blogService: BlogService,
              private entryService: EntryService,
              private apiService: ApiService,
              public utils: UtilService) {
  }

  ngOnInit(): void {
    /**
     * Get current user data
     */
    AuthService.user.subscribe((user: UserAuth): void => {
      this.user = user;
    });
  }

  /**
   * (Un)Follow a blog for the current user
   *
   * @param blog Blog to (un)follow
   */
  follow(blog: Blog): void {
    this.blogService.followBlog(blog.id).subscribe((response: ApiResponseFollow) => {
      blog.is_following = response.subscribed;
    });
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
    this.apiService.getEndpoint<Blog>(endpoint).subscribe((data: ApiResponse<Blog>): void => {
      this.next = data.next;
      this.loading = false;
      data.results.map((blog: Blog): void => {
        this.blogs.push(blog);
      });
    });
  }
}
