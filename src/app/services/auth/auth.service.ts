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
   * Sign in redirect path
   */
  static readonly REDIRECT_SIGN_IN = ['dash'];

  /**
   * Storage key for authentication token
   */
  private static readonly STORAGE_TOKEN_KEY = 'JWT';

  /**
   * Sign up redirect path
   */
  private static readonly REDIRECT_SIGN_UP = ['feed', 'explore'];

  /**
   * No blogs redirect path
   */
  private static readonly REDIRECT_NO_BLOGS = ['/user/start'];

  /**
   * Sign out redirect path
   */
  static readonly REDIRECT_SIGN_OUT = ['user', 'sign-in'];

  /**
   * It's being used to prevent multiple invalid authentication modal from displaying after another.
   */
  static preventInvalidAuthenticationModal: boolean;

  constructor(private http: HttpClient,
              private toast: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private userService: UserService,
              private api: ApiService) {
    /**
     * Check if user is authenticated
     */
    if (this.isAuth) {
      /**
       * Refresh user if authentication version is old
       */
      if (AuthService.STORAGE_VERSION !== Number(localStorage.getItem(AuthService.STORAGE_VERSION_KEY))) {
        this.userService.getUser().subscribe((): void => {
          // Store storage version
          localStorage.setItem(AuthService.STORAGE_VERSION_KEY, AuthService.STORAGE_VERSION.toString());
          AuthService.preventInvalidAuthenticationModal = false;
        });
      }
      /**
       * Update authenticated user and blog data
       */
      UserService.user = JSON.parse(localStorage.getItem('user'));
      BlogService.blogs = JSON.parse(localStorage.getItem('user')).sites;
    }
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
   * @returns Latest JWT token data from local storage
   */
  static get token(): string {
    return localStorage.getItem(AuthService.STORAGE_TOKEN_KEY);
  }

  /**
   * Set and update JWT token by updating local storage's 'JWT' item.
   *
   * @param token JWT token
   */
  static set token(token: string) {
    localStorage.setItem(AuthService.STORAGE_TOKEN_KEY, token);
  }

  /**
   * @return Whether user authenticated or not
   */
  get isAuth(): boolean {
    return UserService.user !== null;
  }

  /**
   * Un-authenticate user by cleaning localStorage
   *
   * @param toast Determines whether or not we should show a toast regarding signing out.
   * @param redirect When given it will redirect the user the specific route.
   *                 By default it will redirect to {@link AuthService.REDIRECT_SIGN_OUT}.
   * @param noApi Determines whether or not signing out should be with API call.
   */
  signOut(
    toast: boolean = true,
    redirect: string[] = AuthService.REDIRECT_SIGN_OUT,
    noApi?: boolean,
  ): Promise<void> {
    UserService.user = null;
    localStorage.clear();
    // Show toast if needed.
    if (toast) {
      this.toast.info(this.translate.instant('TOAST_SIGN_OUT'));
    }
    // Break code if environment was development. (rest of the code is session based)
    if (environment.development) {
      if (redirect) {
        this.router.navigate(redirect);
      }
      return Promise.resolve();
    }
    // Check if demanding signing out with API call.
    if (!noApi) {
      return this.http.post<void>(`${this.api.base.v1}account/logout/`, null).toPromise().then((): void => {
        if (redirect) {
          this.router.navigate(redirect);
        }
      });
    } else {
      if (redirect) {
        this.router.navigate(redirect);
      }
      return Promise.resolve();
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
        // Store user into localstorage
        UserService.user = data.user;
        BlogService.blogs = data.user.sites;
        // Set token in local storage if current environment in development
        if (environment.development) {
          AuthService.token = data.token;
        }
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
          this.router.navigate(AuthService.REDIRECT_NO_BLOGS);
        }
        AuthService.preventInvalidAuthenticationModal = false;
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

  /**
   * Resend email verification link.
   *
   * @param email User's email address
   */
  resendVerification(email: string): Observable<{ email: string }> {
    return this.http.post<{ email: string }>(`${this.api.base.v1}account/resend-email-confirmation/`, { email });
  }
}
