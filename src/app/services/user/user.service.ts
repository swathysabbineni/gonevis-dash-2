import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '@app/interfaces/auth-response';
import { UserSettings } from '@app/interfaces/user-settings';
import { UserAuth } from '@app/interfaces/user-auth';
import { UserSettingsPatch } from '@app/interfaces/user-settings-patch';
import { ApiService } from '@app/services/api/api.service';
import { AuthService } from '@app/services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  /**
   * Authenticated user ID
   */
  userId: string;

  constructor(private http: HttpClient,
              private apiService: ApiService,
              private authService: AuthService) {
    this.authService.user.subscribe((data: UserAuth): void => {
      this.userId = data.id;
    });
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
    return this.http.get<UserSettings>(`${this.apiService.base.v1}account/users/${this.userId}/`);
  }

  /**
   * Update user profile settings
   *
   * @param payload User settings data
   */
  updateProfile(payload: UserSettingsPatch): Observable<UserSettingsPatch> {
    return this.http.patch<UserSettingsPatch>(`${this.apiService.base.v1}account/update-profile/`, payload);
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
    return this.http.patch<UserSettingsPatch>(`${this.apiService.base.v1}account/update-profile/`, formData);
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