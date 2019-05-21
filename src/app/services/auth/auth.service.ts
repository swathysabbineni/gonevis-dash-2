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
      // Update user subject data
      this.userSubject.next(JSON.parse(localStorage.getItem('user')));
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
  private static parseJwt(token: string): AuthToken | null {
    const base64Url = token.split('.')[1];
    if (typeof base64Url === 'undefined') {
      return null;
    }
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  /**
   * @return Is user authenticated or not
   */
  get isAuth(): boolean {
    return this.cookieService.check('token');
  }

  /**
   * Save/update token to localStorage
   *
   * @param token Authentication token
   */
  setToken(token: string): void {
    this.cookieService.set('token', token, new Date(AuthService.parseJwt(token).exp * 1000), '/');
  }

  /**
   * @returns Stored token from localStorage
   */
  get getToken(): string | null {
    return this.cookieService.get('token');
  }

  /**
   * Un-authenticate user by cleaning localStorage and cookies
   */
  signOut(): void {
    this.cookieService.deleteAll('/');
    localStorage.clear();
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
        // Store token into cookies
        this.setToken(data.token);
        // Store user into local storage.
        localStorage.setItem('user', JSON.stringify(data.user));
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
