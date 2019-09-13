import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, NavigationEnd, Router, RouterEvent, Params } from '@angular/router';
import { UserAuth } from '@app/interfaces/user-auth';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

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
  inDash = true;

  constructor(public auth: AuthService,
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
        this.translate.get(event.title).subscribe((response: string): void => {
          this.title.setTitle(response);
        });
      }
    });
  }
}
