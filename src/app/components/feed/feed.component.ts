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
   * Main navigations
   */
  mainNavs: FeedNav[] = [{
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

  constructor() {
  }

  ngOnInit(): void {
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
