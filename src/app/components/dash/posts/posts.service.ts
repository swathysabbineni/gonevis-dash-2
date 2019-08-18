import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Post } from '@app/interfaces/v1/post';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get blog posts
   */
  getPosts(): Observable<ApiResponse<Post>> {
    return this.http.get<ApiResponse<Post>>(`${this.apiService.base.v1}website/entry`, {
      params: {
        site: BlogService.currentBlog.id
      }
    });
  }
}
