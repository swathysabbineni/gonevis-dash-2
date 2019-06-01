import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { FeedNav } from '@app/interfaces/feed-nav';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faStream } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * List of entries
   */
  entries: EntryFeed[];

  /**
   * Next page endpoint
   */
  next: string;

  /**
   * Main navigations
   */
  mainNavs: FeedNav[] = [{
    label: 'EXPLORE',
    route: 'explore',
    api: this.feedService.getExploreEntries(),
    icon: faSearch,
  }, {
    label: 'FEED',
    route: 'feed',
    api: this.feedService.getSubscribedEntries(),
    icon: faStream,
  }, {
    label: 'BOOKMARKS',
    route: 'bookmarks',
    api: this.feedService.getBookmarkedEntries(),
    icon: faBookmark,
  }];

  /**
   * Tag navigations
   */
  tagNavs: string[] = [
    'Technology',
    'Fashion',
    'Personal',
    'How To',
    'Entertainment',
    'Story',
  ];

  /**
   * Selected navigation/tag
   */
  navSelected: FeedNav;

  constructor(private sanitizer: DomSanitizer,
              private activatedRoute: ActivatedRoute,
              private feedService: FeedService) {
  }

  ngOnInit(): void {
    // Set selected nav
    this.activatedRoute.data.subscribe((data: Data): void => {
      this.mainNavs.map((nav: FeedNav): void => {
        if (nav.route === data.route) {
          this.loading = true;
          this.navSelected = nav;
          this.navSelected.api.subscribe((entries: ApiResponse<EntryFeed>): void => {
            this.next = entries.next;
            this.entries = entries.results;
            this.loading = false;
          });
        }
      });
    });
  }

  /**
   * Tag selection, tho not ready yet
   *
   * @todo Use toast instead of alert
   * @todo Use translation
   * @todo Do me in back-end
   */
  selectTag(event): void {
    alert('Exploring posts by tag is not yet implemented.');
  }
}
