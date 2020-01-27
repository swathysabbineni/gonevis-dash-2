import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '@app/interfaces/auth-response';
import { UserAuth } from '@app/interfaces/user-auth';
import { UserSettings } from '@app/interfaces/user-settings';
import { UserSettingsPatch } from '@app/interfaces/user-settings-patch';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { ApiService } from '@app/services/api/api.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  /**
   * @description
   *
   * Authentication user subject which emits authenticated user's data information value whenever it is subscribed to.
   *
   * @see BehaviorSubject
   */
  private static userSubject: BehaviorSubject<UserAuth> = new BehaviorSubject<UserAuth>(null);

  /**
   * @description
   *
   * An observable snapshot data of {@link userSubject} value
   *
   * @see Observable
   */
  static userObservable: Observable<UserAuth> = UserService.userSubject.asObservable();

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * @description
   *
   * Set and update current authenticated user's data by updating {@link userSubject}'s value and local storage's
   * 'user' item
   *
   * @param data User data information
   */
  static set user(data: UserAuth) {
    localStorage.setItem('user', JSON.stringify(data));
    UserService.userSubject.next(data);
  }

  /**
   * @returns Latest authenticated user's data information from local storage
   */
  static get user(): UserAuth {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  }

  /**
   * @returns Whether or not user has blogs
   */
  static get hasBlogs(): boolean {
    const blogs: BlogMin[] = UserService.user.sites;
    return Boolean(blogs && blogs.length);
  }

  /**
   * Send forgot password link.
   *
   * @param email UserSettings email
   */
  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiService.base.v1}account/forgot-password/`, { email });
  }

  /**
   * Reset password
   *
   * @param password user password
   */
  resetPassword(password: string): Observable<void> {
    return this.http.post<void>(`${this.apiService.base.v1}account/password-reset/`, { password });
  }

  /**
   * Get user information
   */
  getUser(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.apiService.base.v1}account/me/`);
  }

  /**
   * Update user profile settings
   *
   * @param payload User settings data
   */
  updateProfile(payload: UserSettingsPatch): Observable<UserSettingsPatch> {
    return this.http.patch<UserSettingsPatch>(`${this.apiService.base.v1}account/me/`, payload);
  }

  /**
   * Change user profile image
   *
   * @param picture User picture
   */
  setPicture(picture: File): Observable<UserSettingsPatch> {
    // Create form data
    const formData: FormData = new FormData();
    formData.append('picture', picture);
    formData.append('key', picture.name);
    return this.http.patch<UserSettingsPatch>(`${this.apiService.base.v1}account/me/`, formData);
  }

  /**
   * Change user password
   *
   * @param oldPassword User current password
   * @param password New password
   * @param confirmPassword Confirm new password
   */
  setPassword(oldPassword: string, password: string, confirmPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiService.base.v1}account/change-password/`, {
      old_password: oldPassword,
      password,
      confirm_password: confirmPassword,
    });
  }

  /**
   * Verify user's email address
   *
   * @param token Confirmation token
   */
  verifyEmail(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiService.base.v1}account/email-confirmation/`, { token });
  }
}
