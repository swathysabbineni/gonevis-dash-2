import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router, NavigationEnd, RouterEvent } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { BlogService } from '@app/components/feed/blog/blog.service';
import { FeedService } from '@app/components/feed/feed.service';
import { UserService } from '@app/components/feed/user/user.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { User } from '@app/interfaces/user';
import { Vote } from '@app/interfaces/zero/vote';
import { Blog } from '@app/interfaces/zero/blog';
import { Comment } from '@app/interfaces/zero/comment';
import { Entry } from '@app/interfaces/zero/entry';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {

  /**
   * Represents a disposable resource, such as the execution of an Observable.
   * A subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription.
   */
  private readonly subscription: Subscription = new Subscription();

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
   * List of votes of this user
   */
  userVotes: Vote[];

  /**
   * List of comments of this user
   */
  userComments: Comment[];

  /**
   * API loading indicator
   */
  loading = true;

  /**
   * Next page endpoint
   */
  next: string;

  /**
   * Current view (show user entries or blogs or votes or comments)
   */
  current: 'entries' | 'blogs' | 'votes' | 'comments';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private userService: UserService,
              private feedService: FeedService,
              private blogService: BlogService) {
    /**
     * Scroll to top when route navigation ends successfully.
     */
    this.subscription.add(
      this.router.events.pipe(
        filter((event: RouterEvent): boolean => event instanceof NavigationEnd),
      ).subscribe((): void => {
        document.getElementsByClassName('feed-scroller')[0].scrollTo(0, 0);
      }),
    );
  }

  ngOnInit(): void {
    /**
     * Get username from params (and watch)
     */
    this.subscription.add(
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
          /**
           * Update title
           */
          this.title.setTitle(`${this.user.display_name}${AppComponent.TITLE_SUFFIX}`);
        });
        /**
         * Get entries or blogs of this user
         */
        this.setCurrent('entries');
      }),
    );
  }

  /**
   * Set current view and load data
   *
   * @param current Change to this view and load data
   */
  setCurrent(current?: 'entries' | 'blogs' | 'votes' | 'comments'): void {
    if (current) {
      this.current = current;
    }
    if (this.current === 'entries') {
      this.feedService.getEntries({
        username: this.username,
      }).subscribe((data: ApiResponse<Entry>): void => {
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
    } else if (this.current === 'votes') {
      this.userService.getUserVotes(this.user.id).subscribe((data: ApiResponse<Vote>): void => {
        this.next = data.next;
        this.userVotes = data.results;
        this.loading = false;
      });
    } else if (this.current === 'comments') {
      this.userService.getUserComments(this.user.id).subscribe((data: ApiResponse<Comment>): void => {
        this.next = data.next;
        this.userComments = data.results;
        this.loading = false;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
