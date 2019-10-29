import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '@app/interfaces/auth-response';
import { AuthToken } from '@app/interfaces/auth-token';
import { UserAuth } from '@app/interfaces/user-auth';
import { RegisterWithBlogResponse } from '@app/interfaces/v1/register-with-blog-response';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /**
   * Sign in redirect
   */
  private static readonly signInRedirect: string[] = ['feed'];

  /**
   * Sign up redirect
   */
  private static readonly signUpRedirect: string[] = ['dash'];

  /**
   * Sign out redirect
   */
  private static readonly signOutRedirect: string[] = ['start'];

  /**
   * Authenticated user (subject)
   */
  private static userSubject: BehaviorSubject<UserAuth> = new BehaviorSubject<UserAuth>(null);

  /**
   * Authenticated user (observable)
   */
  static user: Observable<UserAuth> = AuthService.userSubject.asObservable();

  constructor(private http: HttpClient,
              private toast: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private cookie: CookieService,
              private api: ApiService) {
    /**
     * Update user (subject) and blogs (subject) if user is authenticated
     * @see isAuth
     */
    if (this.isAuth) {
      const user: UserAuth = JSON.parse(localStorage.getItem('user'));
      AuthService.userSubject.next(user);
      BlogService.set(user.sites.reverse());
    }
  }

  /**
   * Parse JWT token
   *
   * @param token JWT.
   *
   * @return Parsed JWT token.
   */
  private static parseJwt(token: string): AuthToken | null {
    const base64Url = token.split('.')[1];
    if (typeof base64Url === 'undefined') {
      return null;
    }
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  /**
   * Set/update authenticated user data
   *
   * @param userData UserSettings data
   */
  static setAuthenticatedUser(userData: UserAuth): void {
    localStorage.setItem('user', JSON.stringify(userData));
    AuthService.userSubject.next(userData);
  }

  /**
   * @return Is user authenticated or not
   */
  get isAuth(): boolean {
    return this.cookie.check('token');
  }

  /**
   * Save/update token to localStorage
   *
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
  signOut(): void {
    this.cookie.deleteAll('/');
    localStorage.clear();
    AuthService.userSubject.next(null);
    this.toast.info(this.translate.instant('TOAST_SIGN_OUT'));
    this.router.navigate(AuthService.signOutRedirect);
  }

  /**
   * Sign user in
   *
   * @param username User username
   * @param password User password
   * @param showToast Show sign in toast
   * @param redirectPath Redirect after signing up
   *
   * @return String observable which can be subscribed to.
   */
  signIn(
    username: string,
    password: string,
    showToast: boolean = true,
    redirectPath: string[] = AuthService.signInRedirect,
  ): Observable<string> {
    return this.http.post<AuthResponse>(
      `${this.api.base.v1}account/login/`, { username, password },
    ).pipe(
      map((data: AuthResponse): string => {
        // Store token into cookies
        this.setToken(data.token);
        // Store user into local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Update user and blogs subject data
        AuthService.userSubject.next(data.user);
        BlogService.set(data.user.sites.reverse());
        // Show toast
        if (showToast) {
          this.toast.info(this.translate.instant('TOAST_SIGN_IN'), data.user.name);
        }
        // Redirect user to dashboard page if user has at least one blog, otherwise redirect to Feed page
        if (data.user.sites && data.user.sites.length === 0) {
          redirectPath = AuthService.signInRedirect;
        } else if (data.user.sites && data.user.sites.length >= 1) {
          redirectPath = AuthService.signUpRedirect;
        }
        this.router.navigate(redirectPath);
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
        this.signIn(username, password, false).subscribe();
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
        this.signIn(email, password, false, AuthService.signUpRedirect).subscribe();
        return data;
      }),
    );
  }
}
