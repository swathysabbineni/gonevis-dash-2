import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanLoad {

  /**
   * Path to redirect to when user is authenticated and tries to load a guarded route
   */
  private static readonly UN_AUTH_PATH: string[] = ['/user/start'];

  constructor(private router: Router,
              private auth: AuthService) {
  }

  /**
   * A guard deciding if children can be loaded.
   */
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    /**
     * If user is logged-in, then allow user to access current route
     */
    if (this.auth.isAuth) {
      return true;
    }
    /**
     * Not logged-in prevent user from accessing current route and redirect user to start page with the return url
     */
    this.router.navigate(AuthGuardService.UN_AUTH_PATH);
    return false;
  }
}
