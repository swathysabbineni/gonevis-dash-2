import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/interfaces/user';
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
   * Get user detail
   *
   * @param username User username
   */
  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiService.base.zero}website/user/${username}`);
  }
}
