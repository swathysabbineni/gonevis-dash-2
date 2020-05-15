import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { BlogService } from '@app/components/feed/blog/blog.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { NavPill } from '@app/interfaces/nav-pill';
import { Blog } from '@app/interfaces/v1/blog';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faStream } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit, OnDestroy {

  /**
   * Main navigation
   */
  readonly mainNavs: NavPill[] = [{
    label: 'EXPLORE',
    route: 'explore',
    icon: faSearch,
  }, {
    label: 'UPDATES',
    route: 'updates',
    icon: faStream,
  }, {
    label: 'BOOKMARKS',
    route: 'bookmarks',
    icon: faBookmark,
  }];

  /**
   * Following blogs
   */
  blogs: Blog[];

  constructor(private blogService: BlogService) {
  }

  ngOnInit(): void {
    /**
     * Enable search bar
     */
    AppComponent.SEARCH_STATUS.emit(true);
    /**
     * Get following blogs
     */
    this.blogService.getFollowingBlogs({ limit: 10 }).subscribe((data: ApiResponse<Blog>): void => {
      this.blogs = data.results;
    });
  }

  ngOnDestroy(): void {
    /**
     * Disable search bar and query
     */
    AppComponent.SEARCH_STATUS.emit(false);
    AppComponent.SEARCH_QUERY.emit('');
  }

  /**
   * On route activate
   */
  onActivate() {
    /**
     * Clear search query
     */
    AppComponent.SEARCH_QUERY.emit(null);
  }
}
