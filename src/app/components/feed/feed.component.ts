import { Component, OnInit } from '@angular/core';
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
export class FeedComponent implements OnInit {

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
     * Get following blogs
     */
    this.blogService.getFollowingBlogs({ limit: 10 }).subscribe((data: ApiResponse<Blog>): void => {
      this.blogs = data.results;
    });
  }
}
