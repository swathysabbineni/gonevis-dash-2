import { Component, OnInit } from '@angular/core';
import { NavPill } from '@app/interfaces/nav-pill';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faStream } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {

  /**
   * Icons
   */
  readonly hashtag: IconDefinition = faHashtag;

  /**
   * Main navigation
   */
  mainNavs: NavPill[] = [{
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
   * Tag navigation
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
