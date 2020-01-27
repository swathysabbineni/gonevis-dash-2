import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseFollow } from '@app/interfaces/v1/api-response-follow';
import { Blog as v1Blog } from '@app/interfaces/v1/blog';
import { Blog } from '@app/interfaces/zero/blog';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get a blog detail
   *
   * @param id Blog ID
   */
  getBlog(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiService.base.zero}website/site/${id}`);
  }

  /**
   * Get blog list
   *
   * @param user User username
   */
  getBlogs(user?: string): Observable<ApiResponse<Blog>> {
    return this.http.get<ApiResponse<Blog>>(`${this.apiService.base.zero}website/site`, {
      params: {
        user__username: user,
      },
    });
  }

  /**
   * Get list of blogs that current user is following (subscribed to)
   */
  getFollowingBlogs(filters: {
    limit?: number,
  } = {}): Observable<ApiResponse<v1Blog>> {
    return this.http.get<ApiResponse<v1Blog>>(`${this.apiService.base.v1}website/site/`, {
      params: Object.assign(filters, {
        show: 'subscribed',
      }),
    });
  }

  /**
   * (Un)Follow a blog for the current user
   *
   * @param id Blog ID
   */
  followBlog(id: string): Observable<ApiResponseFollow> {
    return this.http.post<ApiResponseFollow>(`${this.apiService.base.zero}website/site/${id}/subscribe/`, {});
  }
}
