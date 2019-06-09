import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectType } from '@app/enums/object-type';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { CommentFeed } from '@app/interfaces/comment-feed';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntryService {

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  /**
   * Load entry data
   *
   * @param id Entry ID
   */
  getEntry(id: string): Observable<EntryFeed> {
    return this.http.get<EntryFeed>(`${this.apiService.base.zero}website/entry/${id}/`);
  }

  /**
   * Load all entry comments
   *
   * @param id Entry ID
   */
  getEntryComments(id: string): Observable<ApiResponse<CommentFeed>> {
    return this.http.get<ApiResponse<CommentFeed>>(`${this.apiService.base.zero}website/entry/${id}/comments/`);
  }

  /**
   * Toggle entry like by user
   *
   * @param id Entry ID
   */
  like(id: string): Observable<ApiResponseCreated> {
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

  /**
   * Comment on an entry
   *
   * @param id Entry ID
   * @param comment Comment content
   */
  commentEntry(id: string, comment: string): Observable<CommentFeed> {
    return this.http.post<CommentFeed>(`${this.apiService.base.zero}website/entry/${id}/comment/`, {
      comment,
      object_id: ObjectType.ENTRY,
    });
  }
}
