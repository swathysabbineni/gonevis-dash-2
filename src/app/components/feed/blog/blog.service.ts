import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
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
}
