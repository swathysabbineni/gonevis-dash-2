import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { FeedNav } from '@app/interfaces/feed-nav';
import { ApiService } from '@app/services/api/api.service';
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
              private feedService: FeedService,
              private apiService: ApiService) {
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
   * Toggle entry like for user
   *
   * @param entry Entry to like
   */
  like(entry: EntryFeed): void {
    // Check for loading
    if (entry.loading) {
      return;
    }
    entry.loading = true;
    // Update like count
    if (entry.is_voted) {
      entry.vote_count--;
    } else {
      entry.vote_count++;
    }
    // Update voted
    entry.is_voted = !entry.is_voted;
    // API call
    this.feedService.likeEntry(entry.id).subscribe((data: ApiResponseCreated): void => {
      entry.is_voted = data.created;
      entry.loading = false;
    });
  }

  /**
   * Toggle entry bookmark for user
   *
   * @param entry Entry to bookmark
   */
  bookmark(entry: EntryFeed): void {
    // Check for loading
    if (entry.loading) {
      return;
    }
    entry.loading = true;
    // Update is bookmarked
    entry.is_bookmarked = !entry.is_bookmarked;
    // API call
    this.feedService.bookmark(entry.id).subscribe((data: ApiResponseCreated): void => {
      entry.is_bookmarked = data.created;
      entry.loading = false;
    });
  }

  /**
   * Bypass security and trust the given value to be safe style value (CSS).
   *
   * @param url Entry cover image URL
   */
  getBackgroundImage(url: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
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
    this.apiService.getEndpoint<EntryFeed>(endpoint).subscribe((data: ApiResponse<EntryFeed>): void => {
      this.next = data.next;
      this.loading = false;
      data.results.map((entry: EntryFeed): void => {
        this.entries.push(entry);
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
