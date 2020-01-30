import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SidebarLink } from '@app/interfaces/sidebar-link';
import { UserAuth } from '@app/interfaces/user-auth';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { FeedbackModalComponent } from '@app/shared/feedback-modal/feedback-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons/faNewspaper';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {

  readonly blogService = BlogService;

  /**
   * Angle double left icon
   */
  readonly faAngleDoubleLeft: IconDefinition = faAngleDoubleLeft;

  /**
   * Authenticated user data
   */
  user: UserAuth;

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
    path: 'navs',
    label: 'NAVS',
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
              private router: Router,
              private modalService: BsModalService,
              private translateService: TranslateService,
              public authService: AuthService) {
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

  ngOnInit(): void {
    /**
     * Get authenticated user data (and watch for changes)
     */
    UserService.userObservable.subscribe((user: UserAuth): void => {
      this.user = user;
    });
  }

  /**
   * Toggle sidebar and update local storage value
   */
  toggleSidebar(): void {
    localStorage.setItem('sidebar', String(!this.openSidebar));
    this.openSidebar = !this.openSidebar;
  }

  /**
   * Open feedback modal
   */
  feedback(): void {
    this.modalService.show(FeedbackModalComponent);
  }

  /**
   * Sign out user by a confirm message
   */
  signOut(): void {
    if (confirm(this.translateService.instant('SIGN_OUT_PROMPT'))) {
      this.authService.signOut();
    }
  }
}
