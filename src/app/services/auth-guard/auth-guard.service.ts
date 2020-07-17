import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  Router,
  UrlSegment,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Navigation,
} from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { UserService } from '@app/services/user/user.service';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanLoad, CanActivate {

  /**
   * Path to redirect to when user is authenticated and tries to load a guarded route
   */
  private static readonly UN_AUTH_PATH: string[] = ['/user/start'];

  constructor(private router: Router,
              private auth: AuthService,
              private userService: UserService) {
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
    if (!environment.development) {
      // Get current navigation which we will use to store current navigation's URL.
      const navigation: Navigation | null = this.router.getCurrentNavigation();
      let url = '/';
      // Store navigation's URL.
      if (navigation) {
        url = navigation.extractedUrl.toString();
      }
      // Get user data and on success redirect user to stored URL.
      this.userService.getUser(true).subscribe((): void => {
        this.router.navigateByUrl(url);
      });
    }
    /**
     * Not logged-in prevent user from accessing current route and redirect user to start page with the return url
     */
    this.router.navigate(AuthGuardService.UN_AUTH_PATH);
    return false;
  }

  /**
   * A guard deciding if children can be activated.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
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
