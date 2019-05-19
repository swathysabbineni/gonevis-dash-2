import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { TokenObject } from '@app/interfaces/token-object';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // token subject
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  // User subject
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public user: Observable<any>;

  constructor(private http: HttpClient, private router: Router,
              private cookieService: CookieService, private apiService: ApiService) {
    // If user is authenticated, then store token and user subjects with their local storage values.
    if (this.isAuth) {
      // Update token subject data.
      this.tokenSubject.next(this.cookieService.get('token'));
      // Update user subject data.
      this.userSubject.next(JSON.parse(this.cookieService.get('user')));
    }
    this.user = this.userSubject.asObservable();
  }

  /**
   * @return User subject's value.
   */
  public get userValue(): any {
    return this.userSubject.value;
  }

  /**
   * Parse JWT from token.
   *
   * @param token JWT.
   *
   * @return Parsed JWT token.
   */
  static parseJwt(token: string): TokenObject | null {
    const base64Url = token.split('.')[1];

    if (typeof base64Url === 'undefined') {
      return null;
    }

    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  /**
   * Get token's expiration data.
   *
   * @param token JWT.
   *
   * @return An object which will contain an expiration date.
   */
  static getTokenOption(token: string): { expires: Date } {
    // Get token object.
    const tokenObject: TokenObject = AuthService.parseJwt(token);
    let options: { expires: Date } = null;
    // Set token expiration.
    if (tokenObject) {
      options = {
        expires: new Date(tokenObject.exp * 1000),
      };
    }
    return options;
  }

  /**
   * @return Token subject's value.
   */
  public get tokenValue(): string {
    return this.tokenSubject.value;
  }

  /**
   * @return Boolean which determines whether 'token' exists in cookies or not.
   */
  public get isAuth(): boolean {
    return this.cookieService.check('token');
  }

  /**
   * Delete all cookie keys and clear token subject and user subject values.
   */
  public unAuth(): void {
    // Remove all cookie keys.
    this.cookieService.deleteAll('/');
    // Clear token subject value.
    this.tokenSubject.next(null);
    // Clear user subject value.
    this.userSubject.next(null);
  }

  /**
   * Sign in user by given username and password.
   *
   * @param payload Contains two keys: username and password.
   *
   * @return String observable which can be subscribed to.
   */
  signIn(payload: { username: string, password: string }): Observable<string> {
    return this.http.post(this.apiService.base.v1 + 'account/login/', payload)
      .pipe(
        map((data: any): string => {
          // Update and store token into cookies.
          this.cookieService.set('token', data.token, AuthService.getTokenOption(data.token).expires, '/');
          // Update and store user into cookies.
          this.cookieService.set('user', JSON.stringify(data.user), null, '/');
          // Store first blog into local storage.
          this.cookieService.set('blog', JSON.stringify(data.user.sites[0]), null, '/');
          // Update token subject data.
          this.tokenSubject.next(data.token);
          // Update user subject data.
          this.userSubject.next(data.user);
          // Return raw user data.
          return data.user.username;
        })
      );
  }

  /**
   * Sign in user by given username and password
   *
   * @param email User email
   * @param username User username
   * @param password user password
   */
  signUp(email: string, username: string, password: string): Observable<any> {
    return this.http.post(this.apiService.base.v1 + 'account/register-account-only/', {
      email,
      username,
      password,
    });
  }
}
