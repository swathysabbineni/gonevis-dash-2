import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthToken } from '@app/interfaces/auth-token';
import { ApiService } from '@app/services/api/api.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /**
   * Authentication token subject
   */
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * Authentication user subject
   */
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  /**
   * Authenticated user
   */
  user: Observable<any>;

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService,
              private apiService: ApiService) {
    // If user is authenticated, then store token and user subjects with their local storage values
    if (this.isAuth) {
      // Update token subject data
      this.tokenSubject.next(this.cookieService.get('token'));
      // Update user subject data
      this.userSubject.next(JSON.parse(this.cookieService.get('user')));
    }
    this.user = this.userSubject.asObservable();
  }

  /**
   * Parse JWT from token.
   *
   * @param token JWT.
   *
   * @return Parsed JWT token.
   */
  static parseJwt(token: string): AuthToken | null {
    const base64Url = token.split('.')[1];
    if (typeof base64Url === 'undefined') {
      return null;
    }
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  /**
   * Get token expiration data
   *
   * @param token JWT.
   *
   * @return An object which will contain an expiration date.
   */
  static getTokenOption(token: string): { expires: Date } {
    // Get token object
    const parsedToken: AuthToken = AuthService.parseJwt(token);
    let options: { expires: Date } = null;
    // Set token expiration
    if (parsedToken) {
      options = {
        expires: new Date(parsedToken.exp * 1000),
      };
    }
    return options;
  }

  /**
   * @return Token subject value
   */
  get tokenValue(): string {
    return this.tokenSubject.value;
  }

  /**
   * @return Is user authenticated or not
   */
  get isAuth(): boolean {
    return this.cookieService.check('token');
  }

  /**
   * Un-authenticate user by cleaning localStorage and cookies
   */
  unAuth(): void {
    // Remove all cookie keys.
    this.cookieService.deleteAll('/');
    // Clear token subject value.
    this.tokenSubject.next(null);
    // Clear user subject value.
    this.userSubject.next(null);
  }

  /**
   * Sign user in
   *
   * @param username User username
   * @param password User password
   *
   * @return String observable which can be subscribed to.
   */
  signIn(username: string, password: string): Observable<string> {
    return this.http.post(this.apiService.base.v1 + 'account/login/', { username, password }).pipe(
      map((data: any): string => {
        // Update and store token into cookies
        this.cookieService.set('token', data.token, AuthService.getTokenOption(data.token).expires, '/');
        // Update and store user into cookies
        this.cookieService.set('user', JSON.stringify(data.user), null, '/');
        // Store first blog into local stora ge
        this.cookieService.set('blog', JSON.stringify(data.user.sites[0]), null, '/');
        // Update token subject data
        this.tokenSubject.next(data.token);
        // Update user subject data
        this.userSubject.next(data.user);
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
   * @param password user password
   */
  signUp(email: string, username: string, password: string): Observable<any> {
    return this.http.post(this.apiService.base.v1 + 'account/register-account-only/', {
      email, username, password,
    });
  }
}
