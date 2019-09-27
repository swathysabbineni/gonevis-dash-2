import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/zero/entry';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedService {

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * Get entries with filters
   */
  getEntries(params: {
    blog?: string,
    user?: string,
    show?: 'feed' | 'bookmarked' | '',
  } = {}): Observable<ApiResponse<Entry>> {
    return this.http.get<ApiResponse<Entry>>(`${this.api.base.zero}website/entry/`, { params });
  }
}
