import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { UserAuth } from '@app/interfaces/user-auth';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
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
   * Authenticated user blog list
   */
  blogs: BlogMin[];

  /**
   * Current blog
   */
  blogCurrent: BlogMin;

  /**
   * Is user in any dash page
   */
  inDash: boolean;

  constructor(public auth: AuthService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title,
              private modalService: BsModalService) {
  }

  ngOnInit(): void {
    /**
     * Is user in any dash page
     */
    this.router.events.pipe(
      filter((event: RouterEvent): boolean => event instanceof NavigationEnd),
      map((): ActivatedRoute => this.route),
      filter((activatedRoute: ActivatedRoute): boolean => {
        return activatedRoute.outlet === 'primary' && !!activatedRoute.firstChild;
      }),
    ).subscribe((): void => {
      this.inDash = this.route.root.firstChild.snapshot.routeConfig.path === 'dash';
    });

    /**
     * Set the default language
     */
    this.translate.setDefaultLang('en');

    /**
     * Get authenticated user data (and watch for changes)
     */
    AuthService.user.subscribe((user: UserAuth): void => {
      this.user = user;
    });

    /**
     * Get authenticated user blogs (and watch for changes)
     */
    BlogService.blogs.subscribe((blogs: BlogMin[]): void => {
      this.blogs = blogs;
    });

    /**
     * Get current blog (and watch for changes)
     */
    BlogService.blog.subscribe((blog: BlogMin): void => {
      this.blogCurrent = blog;
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
     * On '/' route visit redirect user conditionally based on authentication state and blogs count
     */
    this.router.events.pipe(
      filter((event: RouterEvent): boolean => event instanceof NavigationEnd && event.url === '/'),
    ).subscribe((): void => {
      if (this.auth.isAuth) {
        /**
         * Redirect to 'dash' route if user has blogs, otherwise redirect to 'feed' route
         */
        if (BlogService.hasBlogs) {
          this.router.navigate(['dash', BlogService.currentBlog ? BlogService.currentBlogIndex : 0]);
        } else {
          this.router.navigateByUrl('feed');
        }
      } else {
        this.router.navigateByUrl('start');
      }
    });
  }

  /**
   * Redirect to 'dash' route if user has blogs, otherwise redirect to 'start' route
   */
  get navigateToDash(): any[] {
    if (BlogService.hasBlogs) {
      return ['dash', BlogService.currentBlog ? BlogService.currentBlogIndex : 0];
    } else {
      return ['start'];
    }
  }

  /**
   * Set current blog
   *
   * @param index Blog index
   */
  setCurrentBlog(index: number): void {
    /**
     * Find current blog index
     */
    const blogIndex: number = this.user.sites.findIndex((data: BlogMin): boolean => {
      return BlogService.currentBlog.id === data.id;
    });
    this.router.navigateByUrl(this.router.url.replace(blogIndex.toString(), index.toString()));
  }

  /**
   * Open feedback modal
   */
  feedback(): void {
    this.modalService.show(FeedbackModalComponent);
  }
}
