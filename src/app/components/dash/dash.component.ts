import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { SidebarLink } from '@app/interfaces/sidebar-link';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons/faNewspaper';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent {

  /**
   * Angle double left icon
   */
  readonly faAngleDoubleLeft: IconDefinition = faAngleDoubleLeft;

  /**
   * Determines whether or not current page is the editor or not
   */
  isWritePage: boolean;

  /**
   * Determines whether sidebar is closed or not
   */
  openSidebar: boolean;

  /**
   * Sidebar items
   */
  links: SidebarLink[] = [{
    path: 'main',
    label: 'DASHBOARD',
    icon: faTachometerAlt,
  }, {
    path: 'write',
    label: 'WRITE',
    icon: faPen,
  }, {
    path: 'posts',
    label: 'POSTS',
    icon: faThLarge,
  }, {
    path: 'pages',
    label: 'PAGES',
    icon: faNewspaper,
  }, {
    path: 'comments',
    label: 'COMMENTS',
    icon: faComment,
  }, {
    path: 'tags',
    label: 'TAGS',
    icon: faHashtag,
  }, {
    path: 'media',
    label: 'MEDIA',
    icon: faImage,
  }, {
    path: 'statistics',
    label: 'STATISTICS',
    icon: faChartLine,
  }, {
    path: 'navigation',
    label: 'NAVIGATION',
    icon: faBars,
  }, {
    path: 'team',
    label: 'TEAM',
    icon: faUser,
  }, {
    path: 'settings',
    label: 'SETTINGS',
    icon: faCog,
  }, {
    path: 'help',
    label: 'HELP',
    icon: faInfoCircle,
  }];

  constructor(private route: ActivatedRoute,
              private router: Router) {
    /**
     * Get blog index from param (and watch for changes)
     */
    this.route.params.subscribe((params: Params): void => {
      const index: number = +params.blog;
      /**
       * If blog doesn't exist by given index in params, then redirect to first blog.
       */
      if (!BlogService.blogs[index]) {
        this.router.navigate(['dash', 0]);
      }
    });
    if (JSON.parse(localStorage.getItem('sidebar')) === null) {
      this.toggleSidebar();
    } else {
      this.openSidebar = JSON.parse(localStorage.getItem('sidebar'));
    }
  }

  /**
   * Toggle sidebar and update local storage value
   */
  toggleSidebar(): void {
    localStorage.setItem('sidebar', String(!this.openSidebar));
    this.openSidebar = !this.openSidebar;
  }
  /**
   * On router outlet change
   */
  onRouterOutletChange(event: any): void {
    this.isWritePage = !!(event.activatedRoute && event.activatedRoute.snapshot.data.editor);
    /**
     * Notify navbar status to hide it
     */
    AppComponent.NAVBAR_STATUS.next(this.isWritePage);
  }
}
