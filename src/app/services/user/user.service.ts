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
   * Reset password
   *
   * @param password user password
   */
  resetPassword(password: string): Observable<object> {
    return this.http.post(`${this.apiService.base.v1}account/register-account-only/`, { password });
  }
}
