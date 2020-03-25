import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '@app/interfaces/auth-response';
import { AuthToken } from '@app/interfaces/auth-token';
import { RegisterWithBlogResponse } from '@app/interfaces/v1/register-with-blog-response';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /**
   * Storage version to use to force user to sign in again (should only be increased)
   */
  static readonly STORAGE_VERSION = 8;

  /**
   * Storage key for storage version
   */
  static readonly STORAGE_VERSION_KEY = 'version';

  /**
   * Storage key for authentication token
   */
  static readonly STORAGE_TOKEN_KEY = 'JWT';

  /**
   * Sign in redirect path
   */
  static readonly REDIRECT_SIGN_IN = ['dash'];

  /**
   * Sign up redirect path
   */
  private static readonly REDIRECT_SIGN_UP = ['feed', 'explore'];

  /**
   * Sign out redirect path
   */
  private static readonly REDIRECT_SIGN_OUT = ['user', 'sign-in'];

  /**
   * No blogs redirect path
   */
  private static readonly NO_BLOGS_PATH = ['/user/start'];

  constructor(private http: HttpClient,
              private toast: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private cookie: CookieService,
              private api: ApiService) {
    /**
     * Check if user is authenticated
     */
    if (this.isAuth) {
      /**
       * Sign user out if authentication version is old
       */
      if (AuthService.STORAGE_VERSION !== Number(localStorage.getItem(AuthService.STORAGE_VERSION_KEY))) {
        this.signOut(false, ['user', 'sign-in']).then(() => {
          this.toast.info(this.translate.instant('TEXT_OLD_AUTH_VERSION'), this.translate.instant('SIGN_IN_AGAIN'));
        });
        return;
      }
      /**
       * Update authenticated user and blog data
       */
      UserService.user = JSON.parse(localStorage.getItem('user'));
      BlogService.blogs = JSON.parse(localStorage.getItem('user')).sites;
    }
  }

  /**
   * @returns Cookie domain based on environment
   */
  private static getCookieDomain() {
    let domain: string = environment.cookieDomain;
    if (environment.development && !domain.includes(location.hostname)) {
      domain = location.hostname;
    }
    return domain;
  }

  /**
   * @return Parsed JTW token
   * @param token JWT token
   */
  static parseJwt(token: string): AuthToken {
    const BASE64_URL: string = token.split('.')[1];
    if (typeof BASE64_URL === 'undefined') {
      return;
    }
    return JSON.parse(atob(BASE64_URL.replace('-', '+').replace('_', '/')));
  }

  /**
   * @return Whether user authenticated or not
   */
  get isAuth(): boolean {
    return this.cookie.check(AuthService.STORAGE_TOKEN_KEY);
  }

  /**
   * Update authentication token
   * @param token Authentication token
   * @returns Whether token was set or not
   */
  setToken(token: string): boolean {
    const parsedJwt: AuthToken = AuthService.parseJwt(token);
    if (parsedJwt) {
      this.cookie.set(AuthService.STORAGE_TOKEN_KEY,
        token,
        new Date(parsedJwt.exp * 1000),
        '/',
        AuthService.getCookieDomain(),
        null,
        'Lax',
      );
      return true;
    }
    return false;
  }

  /**
   * @returns Stored token from localStorage
   */
  getToken(): string | null {
    return this.cookie.get(AuthService.STORAGE_TOKEN_KEY);
  }

  /**
   * Un-authenticate user by cleaning localStorage and cookies
   */
  signOut(toast: boolean = true, redirect: string[] = AuthService.REDIRECT_SIGN_OUT): Promise<boolean> {
    this.cookie.deleteAll('/', AuthService.getCookieDomain());
    // Cookies don't get deleted sometimes so let's expire it
    this.cookie.set(AuthService.STORAGE_TOKEN_KEY, '', new Date(), '/', AuthService.getCookieDomain(), null, 'Lax');
    UserService.user = null;
    localStorage.clear();
    if (toast) {
      this.toast.info(this.translate.instant('TOAST_SIGN_OUT'));
    }
    if (redirect) {
      return this.router.navigate(redirect);
    }
  }

  /**
   * Sign user in
   *
   * @param username User username
   * @param password User password
   * @param showToast Show sign in toast
   * @param redirectPath Redirect after signing up
   */
  signIn(
    username: string,
    password: string,
    showToast: boolean = true,
    redirectPath?: string[],
  ): Observable<string> {
    return this.http.post<AuthResponse>(
      `${this.api.base.v1}account/login/`, { username, password },
    ).pipe(
      map((data: AuthResponse): string => {
        // Store token into cookies
        this.setToken(data.token);
        // Store user into localstorage
        UserService.user = data.user;
        BlogService.blogs = data.user.sites;
        // Store storage version
        localStorage.setItem(AuthService.STORAGE_VERSION_KEY, AuthService.STORAGE_VERSION.toString());
        // Show toast
        if (showToast) {
          this.toast.info(this.translate.instant('TOAST_SIGN_IN'), data.user.name);
        }
        // Redirect user to dashboard page if user has at least one blog, otherwise redirect to Feed page
        if (!redirectPath) {
          this.router.navigate(UserService.hasBlogs ? AuthService.REDIRECT_SIGN_IN : ['feed', 'explore']);
        } else if (UserService.hasBlogs) {
          this.router.navigate(redirectPath);
        } else {
          this.router.navigate(AuthService.NO_BLOGS_PATH);
        }
        // Return raw user data
        return data.user.username;
      }),
    );
  }

  /**
   * Sign user up
   *
   * @param payload Register payload, include email for registration only and invite_id for collaboration
   */
  signUp(payload: {
    email?: string;
    username: string;
    password: string;
    invite_id?: string;
  }): Observable<void> {
    /**
     * Different endpoints for register and collaboration
     */
    let endpoint = 'register-account-only';
    if (payload.invite_id) {
      endpoint = 'invitation-register';
    }
    /**
     * Final API call
     */
    return this.http.post(`${this.api.base.v1}account/${endpoint}/`, payload).pipe(
      map((): void => {
        this.toast.info(this.translate.instant('TOAST_SIGN_UP'), payload.username);
        this.signIn(payload.username, payload.password, false, AuthService.REDIRECT_SIGN_UP).subscribe();
      }),
    );
  }

  /**
   * Sign user up and create a blog
   *
   * @param email User email
   * @param password User password
   * @param blogName Blog title
   * @param blogUrl Blog URL (sub-domain)
   * @param blogTheme Blog template ID
   */
  signUpWithBlog(
    email: string,
    password: string,
    blogName: string,
    blogUrl: string,
    blogTheme: string,
  ): Observable<RegisterWithBlogResponse> {
    return this.http.post<RegisterWithBlogResponse>(this.api.base.v1 + 'account/register/', {
      email,
      password,
      site_name: blogName,
      site_url: blogUrl,
      template_id: blogTheme,
    }).pipe(
      map((data: RegisterWithBlogResponse): RegisterWithBlogResponse => {
        this.toast.info(this.translate.instant('TOAST_SIGN_UP'), blogName);
        this.signIn(email, password, false).subscribe();
        return data;
      }),
    );
  }
}
