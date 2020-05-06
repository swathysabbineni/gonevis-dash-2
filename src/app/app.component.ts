import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { UserAuth } from '@app/interfaces/user-auth';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { FeedbackModalComponent } from '@app/shared/feedback-modal/feedback-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faRssSquare } from '@fortawesome/free-solid-svg-icons/faRssSquare';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  /**
   * Window title without suffix
   */
  static readonly TITLE = 'GoNevis';

  /**
   * Window title with suffix
   */
  static readonly TITLE_SUFFIX = ` - ${AppComponent.TITLE}`;

  /**
   * Used for status of search bar
   */
  static SEARCH_STATUS: BehaviorSubject<boolean>;

  readonly blogService = BlogService;

  readonly faFeed: IconDefinition = faRssSquare;
  readonly faFeedback: IconDefinition = faQuestionCircle;
  readonly faProfile: IconDefinition = faUserCircle;
  readonly faSettings: IconDefinition = faCog;
  readonly faSignOut: IconDefinition = faSignOutAlt;

  /**
   * Status of search bar
   * @see SEARCH_STATUS
   */
  searchStatus: boolean;

  /**
   * Authenticated user data
   */
  user: UserAuth;

  /**
   * List of blogs
   */
  blogs: BlogMin[] = [];

  constructor(public authService: AuthService,
              private modalService: BsModalService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    AppComponent.SEARCH_STATUS = new BehaviorSubject<boolean>(false);
    this.cd.detectChanges();
    /**
     * Set the default language
     */
    this.translate.setDefaultLang('en');
    /**
     * Watch search status changes
     * @see SEARCH_STATUS
     */
    AppComponent.SEARCH_STATUS.subscribe((status: boolean): void => {
      this.searchStatus = status;
    });
    /**
     * Get authenticated user data (and watch for changes)
     */
    UserService.userObservable.subscribe((user: UserAuth): void => {
      this.user = user;
    });
    /**
     * Get blog list's data (and watch for changes)
     */
    BlogService.blogsObservable.subscribe((blogs: BlogMin[]): void => {
      this.blogs = blogs;
    });
    /**
     * Watch for page changes then update window title with translation
     */
    this.router.events.pipe(
      filter((event: RouterEvent): boolean => event instanceof NavigationEnd),
      map((): ActivatedRoute => this.route),
      map((activatedRoute: ActivatedRoute): ActivatedRoute => {
        while (activatedRoute.firstChild) {
          activatedRoute = activatedRoute.firstChild;
        }
        return activatedRoute;
      }),
      filter((activatedRoute: ActivatedRoute): boolean => activatedRoute.outlet === 'primary'),
      mergeMap((activatedRoute: ActivatedRoute): Observable<Data> => activatedRoute.data),
    ).subscribe((event: Data): void => {
      if (event.title) {
        this.title.setTitle(`${this.translate.instant(event.title)}${AppComponent.TITLE_SUFFIX}`);
      } else {
        this.title.setTitle(AppComponent.TITLE);
      }
    });
  }

  /**
   * Check if user is authenticated
   */
  get isAuth(): boolean {
    return this.authService.isAuth;
  }

  /**
   * Redirect to 'dash' route if user has blogs, otherwise redirect to 'start' route
   */
  get navigateToDash(): any[] {
    if (UserService.hasBlogs) {
      return ['dash', BlogService.currentBlog ? BlogService.currentBlogIndex : 0];
    } else {
      return ['start'];
    }
  }

  /**
   * Sign out user by a confirm message
   */
  signOut(): void {
    this.authService.signOut();
  }

  /**
   * Open feedback modal
   */
  feedback(): void {
    this.modalService.show(FeedbackModalComponent);
  }
}
