import { Injectable } from '@angular/core';
import { Route, UrlSegment, CanLoad, Router } from '@angular/router';
import { BlogService } from '@app/services/blog/blog.service';

@Injectable({
  providedIn: 'root',
})
export class DashGuardService implements CanLoad {

  private static readonly NO_BLOGS_PATH = ['start'];

  constructor(private router: Router) {
  }

  /**
   * A guard deciding if children can be loaded.
   */
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    /**
     * If user has blogs, then allow user to access current route
     */
    if (BlogService.hasBlogs) {
      return true;
    }
    /**
     * Prevent user from accessing current route and redirect user to start page when no blogs found
     */
    this.router.navigate(DashGuardService.NO_BLOGS_PATH);
    return false;
  }
}
