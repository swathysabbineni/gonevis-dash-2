import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { DashUiStatus } from '@app/enums/dash-ui-status';
import { UserAuth } from '@app/interfaces/user-auth';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { FeedbackModalComponent } from '@app/shared/feedback-modal/feedback-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faRssSquare } from '@fortawesome/free-solid-svg-icons/faRssSquare';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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
  static readonly UI_STATUS = new EventEmitter<DashUiStatus>();

  /**
   * Used for status of search bar
   */
  static readonly SEARCH_STATUS = new EventEmitter<boolean>();

  /**
   * Used for query of search
   */
  static readonly SEARCH_QUERY = new EventEmitter<string>();

  /**
   * Used for query of search for every update
   */
  static readonly SEARCH_QUERY_UPDATE = new EventEmitter<string>();

  /**
   * Used for suggestions of search
   */
  static readonly SEARCH_SUGGESTIONS = new EventEmitter<string[]>();

  /**
   * Used for click event on search suggestion
   */
  static readonly SEARCH_SUGGESTION_CLICK = new EventEmitter<string>();

  readonly blogService = BlogService;

  readonly faFeed: IconDefinition = faRssSquare;
  readonly faFeedback: IconDefinition = faQuestionCircle;
  readonly faProfile: IconDefinition = faUserCircle;
  readonly faSettings: IconDefinition = faCog;
  readonly faSignOut: IconDefinition = faSignOutAlt;
  readonly faUnverified: IconDefinition = faExclamationTriangle;

  readonly dashUiStatus = DashUiStatus;

  /**
   * Status of header/sidebar (show or hide)
   */
  uiStatus: DashUiStatus = DashUiStatus.ALL;

  /**
   * Status of search bar
   * @see SEARCH_STATUS
   */
  searchStatus: boolean;

  /**
   * Search suggestions to show to user
   * @see SEARCH_SUGGESTIONS
   */
  searchSuggestions: string[];

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

  /**
   * Determines email verification API call state.
   */
  resending: boolean;

  /**
   * Determines whether or not email verification has been sent successfully.
   */
  verificationSent: boolean;

  constructor(public authService: AuthService,
              private modalService: BsModalService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService) {
  }

  ngOnInit() {

    /**
     * Set the default language
     */
    this.translate.setDefaultLang('en');
    /**
     * Watch ui status changes
     * @see UI_STATUS
     */
    AppComponent.UI_STATUS.subscribe((status: DashUiStatus): void => {
      setTimeout((): void => {
        this.uiStatus = status;
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
     * Watch search query changes
     * @see SEARCH_QUERY
     */
    AppComponent.SEARCH_QUERY.subscribe((search: string): void => {
      setTimeout((): void => {
        this.formSearch.get('search').setValue(search);
      });
    });
    /**
     * Watch search suggestions changes
     * @see SEARCH_SUGGESTIONS
     */
    AppComponent.SEARCH_SUGGESTIONS.subscribe((suggestions: string[]): void => {
      setTimeout((): void => {
        this.searchSuggestions = suggestions;
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
    /**
     * Emmit search query changes
     */
    this.formSearch.get('search').valueChanges.subscribe((data: string): void => {
      AppComponent.SEARCH_QUERY_UPDATE.emit(data);
    });
  }

  /**
   * Resend email verification link.
   */
  resendVerification(): void {
    this.resending = true;
    this.authService.resendVerification(this.user.email).subscribe((data: { email: string }): void => {
      this.resending = false;
      this.verificationSent = true;
      // Show a toast to let user know that email verification link has been sent to them.
      this.translate.get('EMAIL_VERIFICATION_SENT', { email: data.email }).subscribe((response: string): void => {
        this.toastrService.success(response);
      });
    }, (error: HttpErrorResponseApi): void => {
      if (error.error.email && error.error.email[0]) {
        this.toastrService.error(error.error.email[0]);
      }
      this.resending = false;
      this.verificationSent = false;
    });
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

  /**
   * On click on search suggestion
   */
  onSearchSuggestionClick(suggestion: string): void {
    AppComponent.SEARCH_SUGGESTION_CLICK.emit(suggestion);
  }
}
