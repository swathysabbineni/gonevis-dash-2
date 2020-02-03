import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { UserAuth } from '@app/interfaces/user-auth';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { FeedbackModalComponent } from '@app/shared/feedback-modal/feedback-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap';
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
   * Authenticated user data
   */
  user: UserAuth;

  /**
   * Is user in any dash page
   */
  inDash: boolean;

  constructor(public authService: AuthService,
              private modalService: BsModalService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title) {
  }

  ngOnInit(): void {
    /**
     * Set the default language
     */
    this.translate.setDefaultLang('en');
    /**
     * Get authenticated user data (and watch for changes)
     */
    UserService.userObservable.subscribe((user: UserAuth): void => {
      this.user = user;
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
      /**
       * Is user in any dash page
       */
      if (this.route.root.firstChild) {
        this.inDash = this.route.root.firstChild.snapshot.routeConfig.path === 'dash';
      }
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
