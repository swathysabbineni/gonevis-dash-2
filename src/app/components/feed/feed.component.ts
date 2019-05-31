import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { RouteNav } from '@app/interfaces/route-nav';
import { AuthService } from '@app/services/auth/auth.service';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faStream } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {

  /**
   * List of entries
   */
  entries: EntryFeed[];

  /**
   * Main navigations
   */
  mainNavs: RouteNav[] = [{
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
  navSelected: RouteNav;

  constructor(private sanitizer: DomSanitizer,
              private activatedRoute: ActivatedRoute,
              private feedService: FeedService) {
  }

  ngOnInit(): void {
    // Set selected nav
    this.activatedRoute.data.subscribe((data: Data): void => {
      this.mainNavs.map((nav: RouteNav): void => {
        if (nav.route === data.route) {
          this.navSelected = nav;
          this.navSelected.api.subscribe((entries: ApiResponse<EntryFeed>): void => {
            this.entries = entries.results;
          });
        }
      });
    });
  }

  /**
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
}
