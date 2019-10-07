import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Params } from '@app/interfaces/params';
import { Comment } from '@app/interfaces/v1/comment';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UtilService } from '@app/services/util/util.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {

  /**
   * API page size
   */
  static readonly PAGE_SIZE = 20;

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get blog tags
   *
   * @param page API page
   */
  getComments(page: number = 1): Observable<ApiResponse<Comment>> {
    return this.http.get<ApiResponse<Comment>>(`${this.apiService.base.v1}sushial/comment`, {
      params: {
        site: BlogService.currentBlog.id,
        limit: CommentsService.PAGE_SIZE.toString(),
        offset: UtilService.getPageOffset(CommentsService.PAGE_SIZE, page),
      },
    });
  }

  /**
   * Update a comment
   *
   * @param comment Comment ID
   * @param params Payload
   */
  updateComment(comment: string, params: Params): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiService.base.v1}sushial/comment/${comment}/`, params);
  }

  /**
   * Delete a comment
   *
   * @param comment Comment ID
   */
  deleteComment(comment: string): Observable<void> {
    return this.http.delete<void>(`${this.apiService.base.v1}sushial/comment/${comment}`);
  }
}
