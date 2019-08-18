import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/v1/entry';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntryService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get blog entries
   */
  getEntries(): Observable<ApiResponse<Entry>> {
    return this.http.get<ApiResponse<Entry>>(`${this.apiService.base.v1}website/entry`, {
      params: {
        site: BlogService.currentBlog.id,
      },
    });
  }
}
