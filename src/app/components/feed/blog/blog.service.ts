import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseFollow } from '@app/interfaces/v1/api-response-follow';
import { Blog } from '@app/interfaces/zero/blog';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * Get a blog detail
   *
   * @param id Blog ID
   */
  getBlog(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.api.base.zero}website/site/${id}/`);
  }

  /**
   * Get blog list
   *
   * @param user User username
   */
  getBlogs(user?: string): Observable<ApiResponse<Blog>> {
    return this.http.get<ApiResponse<Blog>>(`${this.api.base.zero}website/site/`, {
      params: {
        username: user,
      },
    });
  }

  /**
   * Get list of blogs that current user is following (subscribed to)
   */
  getFollowingBlogs(filters: {
    limit?: number,
  } = {}): Observable<ApiResponse<Blog>> {
    return this.http.get<ApiResponse<Blog>>(`${this.api.base.zero}website/site/`, {
      params: Object.assign(filters as Record<string, string>, {
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
    return this.http.post<ApiResponseFollow>(`${this.api.base.zero}website/site/${id}/subscribe/`, {});
  }
}
