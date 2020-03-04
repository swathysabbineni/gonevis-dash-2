import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectType } from '@app/enums/object-type';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { Comment } from '@app/interfaces/comment';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get a single comment
   *
   * @param id Entry ID
   * @param commentId Comment ID
   */
  getComment(id: string, commentId: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiService.base.zero}website/entry/${id}/comment/${commentId}/`);
  }

  /**
   * Comment on an entry
   *
   * @param id Entry ID
   * @param comment Comment content
   */
  comment(id: string, comment: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiService.base.zero}website/entry/${id}/comment/`, {
      comment,
      object_id: ObjectType.Entry,
    });
  }

  /**
   * Like or unlike comment for user
   *
   * @param id Comment ID
   * @param blogId Blog ID
   */
  like(id: string, blogId: string): Observable<ApiResponseCreated> {
    return this.http.post<ApiResponseCreated>(
      `${this.apiService.base.v1}site/${blogId}/sushial/comment/${id}/vote/`,
      null,
    );
  }

  /**
   * Remove comment
   *
   * @param id Comment ID
   * @param blogId Blog ID
   */
  remove(id: string, blogId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiService.base.v1}site/${blogId}/sushial/comment/${id}/`);
  }

  /**
   * Edit comment
   *
   * @param id Comment ID
   * @param comment Edited comment
   */
  edit(id: string, comment: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiService.base.v1}sushial/comment/${id}/`, { comment });
  }
}
