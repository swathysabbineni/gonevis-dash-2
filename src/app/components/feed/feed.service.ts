import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedService {

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  /**
   * Gets list of entries based on given endpoint.
   *
   * @param endpoint Endpoint
   */
  getEntries(endpoint: string): Observable<ApiResponse<EntryFeed>> {
    return this.http.get<ApiResponse<EntryFeed>>(`${this.apiService.base.v1}${endpoint}`);
  }

  /**
   * Toggle entry like by user
   *
   * @param id Entry ID
   */
  likeEntry(id: string): Observable<ApiResponseCreated> {
    return this.http.post<ApiResponseCreated>(`${this.apiService.base.zero}website/entry/${id}/vote/`, null);
  }
}
