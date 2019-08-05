import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { Comment } from '@app/interfaces/comment';
import { Entry } from '@app/interfaces/zero/entry';
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
  getEntry(id: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiService.base.zero}website/entry/${id}/`);
  }

  /**
   * Load all entry comments
   *
   * @param id Entry ID
   */
  getEntryComments(id: string): Observable<ApiResponse<Comment>> {
    return this.http.get<ApiResponse<Comment>>(`${this.apiService.base.zero}website/entry/${id}/comments/`);
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
}
