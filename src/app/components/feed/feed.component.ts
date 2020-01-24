import { Component } from '@angular/core';
import { NavPill } from '@app/interfaces/nav-pill';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faStream } from '@fortawesome/free-solid-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

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

  /**
   * Tag navigation
   */
  readonly tagNavs: string[] = [
    'Technology',
    'Fashion',
    'Personal',
    'How To',
    'Entertainment',
    'Story',
  ];

  constructor(private toast: ToastrService,
              private translate: TranslateService) {
  }

  /**
   * Tag selection, tho not ready yet
   */
  selectTag(): void {
    this.toast.info(this.translate.instant('NOT_IMPLEMENTED_POSTS_BY_TAG'));
  }
}
