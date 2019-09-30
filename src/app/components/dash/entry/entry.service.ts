import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntryFormat } from '@app/enums/entry-format.enum';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/v1/entry';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UtilService } from '@app/services/util/util.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntryService {

  /**
   * API page size
   */
  static readonly PAGE_SIZE = 20;

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get blog entries
   *
   * @param filter API filters
   * @param page API page
   */
  getEntries(
    filter: {
      is_page?: boolean,
      user?: string,
      format?: EntryFormat,
      status?: EntryStatus,
    } = {},
    page: number = 1,
  ): Observable<ApiResponse<Entry>> {
    return this.http.get<ApiResponse<Entry>>(`${this.apiService.base.v1}website/entry`, {
      params: Object.assign(filter, {
        site: BlogService.currentBlog.id,
        limit: EntryService.PAGE_SIZE.toString(),
        offset: UtilService.getPageOffset(EntryService.PAGE_SIZE, page),
      }),
    });
  }

  /**
   * Delete a entry
   *
   * @param id Entry ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiService.base.v1}website/entry/${id}`);
  }
}
