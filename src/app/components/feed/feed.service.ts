import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { UserAuth } from '@app/interfaces/user-auth';
import { Entry } from '@app/interfaces/zero/entry';
import { ApiService } from '@app/services/api/api.service';
import { AuthService } from '@app/services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedService {

  /**
   * User ID
   */
  userId: string;

  constructor(private http: HttpClient,
              private apiService: ApiService) {
    /**
     * Get authenticated user ID (and watch for changes)
     */
    AuthService.user.subscribe((data: UserAuth): void => {
      if (data) {
        this.userId = data.id;
      }
    });
  }

  /**
   * Get entries with filters
   *
   * @param blog Filter by blog ID (in blog)
   * @param user Filter by user username (by author)
   * @param show Determines what types of entries to show
   */
  getEntries(blog: string = '',
             user: string = '',
             show: 'feed' | 'bookmarked' | '' = ''): Observable<ApiResponse<Entry>> {
    return this.http.get<ApiResponse<Entry>>(`${this.apiService.base.zero}website/entry/`, {
      params: {
        site: blog,
        user__username: user,
        show,
      },
    });
  }
}
