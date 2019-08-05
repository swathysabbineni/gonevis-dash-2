import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { UserAuth } from '@app/interfaces/user-auth';
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
              private authService: AuthService,
              private apiService: ApiService) {
    /**
     * Get authenticated user ID (and watch for changes)
     */
    this.authService.user.subscribe((data: UserAuth): void => {
      if (data) {
        this.userId = data.id;
      }
    });
  }

  /**
   * Get entries with filters
   *
   * @param blog Filter by blog ID (in blog)
   * @param user Filter by user ID (by author)
   */
  getEntries(blog: string = '', user: string = ''): Observable<ApiResponse<EntryFeed>> {
    return this.http.get<ApiResponse<EntryFeed>>(`${this.apiService.base.zero}website/entry/`, {
      params: {
        site: blog,
        user__username: user,
      },
    });
  }

  /**
   * Gets subscribed entries
   */
  getSubscribedEntries(): Observable<ApiResponse<EntryFeed>> {
    return this.http.get<ApiResponse<EntryFeed>>(`${this.apiService.base.v1}sushial/subscribed-entries/`);
  }

  /**
   * Get user bookmarked entries
   */
  getBookmarkedEntries(): Observable<ApiResponse<EntryFeed>> {
    return this.http.get<ApiResponse<EntryFeed>>(
      `${this.apiService.base.zero}website/entry/${this.userId}/bookmarks/`,
    );
  }
}
