import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { RouteNav } from '@app/interfaces/route-nav';
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
  mainNavs: RouteNav[] = [{
    label: 'EXPLORE',
    route: 'explore',
    icon: faSearch,
  }, {
    label: 'FEED',
    route: 'feed',
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

  /**
   * Selected navigation/tag
   */
  navSelected: RouteNav;

  constructor(private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Set selected nav
    this.activatedRoute.data.subscribe((data: Data): void => {
      this.mainNavs.map((nav: RouteNav): void => {
        if (nav.route === data.route) {
          this.navSelected = nav;
        }
      });
    });
  }

  /**
   * @fixme Remove me I only exist for debug, my existence doesn't matter
   */
  getBackgroundImage(i: number): SafeStyle {
    return this.sanitizer.sanitize(SecurityContext.STYLE, `url(https://picsum.photos/548?${i})`);
  }
}
