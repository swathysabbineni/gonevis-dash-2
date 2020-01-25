import { Component } from '@angular/core';
import { NavPill } from '@app/interfaces/nav-pill';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faStream } from '@fortawesome/free-solid-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent {

  readonly faTag: IconDefinition = faHashtag;

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
}
