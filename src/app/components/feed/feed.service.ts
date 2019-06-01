import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
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
    this.authService.user.subscribe((data: UserAuth): void => {
      this.userId = data.id;
    });
  }

  /**
   * Get explore entries
   */
  getExploreEntries(): Observable<ApiResponse<EntryFeed>> {
    return this.http.get<ApiResponse<EntryFeed>>(`${this.apiService.base.zero}website/entry/`);
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
    return this.http.get<ApiResponse<EntryFeed>>(`${this.apiService.base.zero}website/entry/${this.userId}/bookmarks/`);
  }

  /**
   * Toggle entry like by user
   *
   * @param id Entry ID
   */
  likeEntry(id: string): Observable<ApiResponseCreated> {
    return this.http.post<ApiResponseCreated>(`${this.apiService.base.zero}website/entry/${id}/vote/`, null);
  }

  /**
   * Toggle entry bookmark by user
   *
   * @param id Entry ID
   */
  bookmark(id: string): Observable<ApiResponseCreated> {
    return this.http.post<ApiResponseCreated>(`${this.apiService.base.zero}website/entry/${id}/bookmark/`, null);
  }
}
