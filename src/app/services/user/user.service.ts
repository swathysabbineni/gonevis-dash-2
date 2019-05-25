import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Send forgot password link.
   *
   * @param email User email
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
}
