import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { User } from '@app/interfaces/user';
import { CommentMin } from '@app/interfaces/zero/comment-min';
import { Vote } from '@app/interfaces/zero/vote';
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
    return this.http.get<User>(`${this.apiService.base.zero}website/user/${username}/`);
  }

  /**
   * Get user likes
   */
  getUserVotes(id?: string): Observable<ApiResponse<Vote>> {
    return this.http.get<ApiResponse<Vote>>(`${this.apiService.base.zero}sushial/votes/`, {
      params: {
        user: id,
      },
    });
  }

  /**
   * Get user comments
   */
  getUserComments(id?: string): Observable<ApiResponse<CommentMin>> {
    return this.http.get<ApiResponse<CommentMin>>(`${this.apiService.base.zero}sushial/comments/`, {
      params: {
        user: id,
      },
    });
  }
}
