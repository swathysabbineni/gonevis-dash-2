import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { BlogService } from '@app/components/feed/blog/blog.service';
import { FeedService } from '@app/components/feed/feed.service';
import { UserService } from '@app/components/feed/user/user.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { User } from '@app/interfaces/user';
import { Blog } from '@app/interfaces/zero/blog';
import { Entry } from '@app/interfaces/zero/entry';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  /**
   * User username (from params)
   */
  username: string;

  /**
   * User detail
   */
  user: User;

  /**
   * List of entries of this user
   */
  entries: Entry[];

  /**
   * List of blogs of this user
   */
  blogs: Blog[];

  /**
   * API loading indicator
   */
  loading = true;

  /**
   * Next page endpoint
   */
  next: string;

  /**
   * Current view (show user entries or blogs)
   */
  current: 'entries' | 'blogs';

  constructor(private route: ActivatedRoute,
              private title: Title,
              private userService: UserService,
              private feedService: FeedService,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    /**
     * Get username from params (and watch)
     */
    this.route.params.subscribe((params: Params): void => {
      /**
       * Store user username
       */
      this.username = params.username;
      /**
       * Get data of this user
       */
      this.userService.getUser(params.username).subscribe((data: User): void => {
        this.user = data;
      });
      /**
       * Get entries or blogs of this user
       */
      this.setCurrent('entries');
      /**
       * Update title
       */
      this.title.setTitle(`${this.user.display_name}${AppComponent.TITLE_SUFFIX}`);
    });
  }

  /**
   * Set current view and load data
   *
   * @param current Change to this view and load data
   */
  setCurrent(current?: 'entries' | 'blogs'): void {
    if (current) {
      this.current = current;
    }
    if (this.current === 'entries') {
      this.feedService.getEntries({ user: this.username }).subscribe((data: ApiResponse<Entry>): void => {
        this.next = data.next;
        this.entries = data.results;
        this.loading = false;
      });
    } else if (this.current === 'blogs') {
      this.blogService.getBlogs(this.username).subscribe((data: ApiResponse<Blog>): void => {
        this.next = data.next;
        this.blogs = data.results;
        this.loading = false;
      });
    }
  }
}
