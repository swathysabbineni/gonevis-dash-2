import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { LabelIcon } from '@app/interfaces/label-icon';
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
  mainNavs: LabelIcon[] = [{
    label: 'EXPLORE',
    icon: faSearch,
  }, {
    label: 'FEED',
    icon: faStream,
  }, {
    label: 'BOOKMARKS',
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
  navSelected: LabelIcon | string = this.mainNavs[1];

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
  }

  /**
   * @fixme Remove me I only exist for debug, my existence doesn't matter
   */
  getBackgroundImage(i: number): SafeStyle {
    return this.sanitizer.sanitize(SecurityContext.STYLE, `url(https://picsum.photos/548?${i})`);
  }
}
