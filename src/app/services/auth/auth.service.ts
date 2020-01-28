import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '@app/interfaces/auth-response';
import { AuthToken } from '@app/interfaces/auth-token';
import { UserAuth } from '@app/interfaces/user-auth';
import { RegisterWithBlogResponse } from '@app/interfaces/v1/register-with-blog-response';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
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
  static readonly STORAGE_VERSION = 6;

  /**
   * Storage key for storage version
   */
  static readonly STORAGE_VERSION_KEY = 'version';

  /**
   * Sign in redirect path
   */
  private static readonly REDIRECT_SIGN_IN = ['dash'];

  /**
   * Sign up redirect path
   */
  private static readonly REDIRECT_SIGN_UP = ['feed', 'explore'];

  /**
   * Sign out redirect path
   */
  private static readonly REDIRECT_SIGN_OUT = ['user', 'sign-in'];

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
    }
  }

  /**
   * @return Parsed JTW token
   * @param token JWT token
   */
  private static parseJwt(token: string): AuthToken {
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
    return this.cookie.check('token');
  }

  /**
   * Update authentication token
   * @param token Authentication token
   */
  setToken(token: string): void {
    const parsedJwt: AuthToken = AuthService.parseJwt(token);
    if (parsedJwt) {
      this.cookie.set('token', token, new Date(parsedJwt.exp * 1000), '/');
    }
  }

  /**
   * @returns Stored token from localStorage
   */
  getToken(): string | null {
    return this.cookie.get('token');
  }

  /**
   * Un-authenticate user by cleaning localStorage and cookies
   */
  signOut(toast: boolean = true, redirect: string[] = AuthService.REDIRECT_SIGN_OUT): Promise<boolean> {
    this.cookie.deleteAll('/');
    UserService.user = null;
    localStorage.clear();
    if (toast) {
      this.toast.info(this.translate.instant('TOAST_SIGN_OUT'));
    }
    return this.router.navigate(redirect);
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
        // Store storage version
        localStorage.setItem(AuthService.STORAGE_VERSION_KEY, AuthService.STORAGE_VERSION.toString());
        // Show toast
        if (showToast) {
          this.toast.info(this.translate.instant('TOAST_SIGN_IN'), data.user.name);
        }
        // Redirect user to dashboard page if user has at least one blog, otherwise redirect to Feed page
        if (!redirectPath) {
          this.router.navigate(UserService.hasBlogs ? AuthService.REDIRECT_SIGN_IN : ['feed', 'explore']);
        } else if (data.user.sites && data.user.sites.length >= 1) {
          this.router.navigate(redirectPath);
        }
        // Return raw user data
        return data.user.username;
      }),
    );
  }

  /**
   * Sign user up
   *
   * @param email User email
   * @param username User username
   * @param password User password
   */
  signUp(email: string, username: string, password: string): Observable<void> {
    return this.http.post(this.api.base.v1 + 'account/register-account-only/', {
      email, username, password,
    }).pipe(
      map((): void => {
        this.toast.info(this.translate.instant('TOAST_SIGN_UP'), username);
        this.signIn(username, password, false, AuthService.REDIRECT_SIGN_UP).subscribe();
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
