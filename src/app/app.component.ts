import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
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
   * Used for hiding navbar
   */
  static readonly HEADER_STATUS = new EventEmitter<boolean>();

  /**
   * Used for status of search bar
   */
  static readonly SEARCH_STATUS = new EventEmitter<boolean>();

  /**
   * Used for query of search
   */
  static readonly SEARCH_QUERY = new EventEmitter<string>();

  readonly blogService = BlogService;

  readonly faFeed: IconDefinition = faRssSquare;
  readonly faFeedback: IconDefinition = faQuestionCircle;
  readonly faProfile: IconDefinition = faUserCircle;
  readonly faSettings: IconDefinition = faCog;
  readonly faSignOut: IconDefinition = faSignOutAlt;

  /**
   * Status of header (show or hide)
   */
  headerStatus = true;

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

  /**
   * Search form
   */
  formSearch: FormGroup;

  constructor(public authService: AuthService,
              private modalService: BsModalService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    /**
     * Set the default language
     */
    this.translate.setDefaultLang('en');
    /**
     * Watch header status changes
     * @see HEADER_STATUS
     */
    AppComponent.HEADER_STATUS.subscribe((hide: boolean): void => {
      setTimeout((): void => {
        this.headerStatus = hide;
      });
    });
    /**
     * Watch search status changes
     * @see SEARCH_STATUS
     */
    AppComponent.SEARCH_STATUS.subscribe((status: boolean): void => {
      setTimeout((): void => {
        this.searchStatus = status;
      });
    });
    /**
     * Watch search status changes
     * @see SEARCH_STATUS
     */
    AppComponent.SEARCH_QUERY.subscribe((search: string): void => {
      setTimeout((): void => {
        this.formSearch.get('search').setValue(search);
      });
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
    /**
     * Setup search form
     */
    this.formSearch = this.formBuilder.group({ search: [''] });
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

  /**
   * On search
   */
  onSearch(): void {
    AppComponent.SEARCH_QUERY.emit(this.formSearch.value.search);
  }
}
