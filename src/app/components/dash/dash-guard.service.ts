import { Injectable } from '@angular/core';
import { Route, UrlSegment, CanLoad, Router } from '@angular/router';
import { UserService } from '@app/services/user/user.service';

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
    if (UserService.hasBlogs) {
      return true;
    }
    /**
     * Prevent user from accessing current route and redirect user to start page when no blogs found
     */
    this.router.navigate(DashGuardService.NO_BLOGS_PATH);
    return false;
  }
}
