import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntryFormat } from '@app/enums/entry-format.enum';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/v1/entry';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UtilService } from '@app/services/util/util.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EntryService {

  /**
   * API page size
   */
  static readonly PAGE_SIZE: number = 20;

  constructor(private http: HttpClient,
              private apiService: ApiService,
              private toast: ToastrService,
              private translate: TranslateService) {
  }

  /**
   * Get blog entries (posts and pages)
   *
   * @param filter API filters
   * @param page API page
   */
  getEntries(
    filter: {
      search?: string,
      is_page?: boolean,
      user?: string,
      format?: EntryFormat | '',
      status?: EntryStatus | '',
      ordering?: string,
      limit?: number,
    } = {},
    page: number = 1,
  ): Observable<ApiResponse<Entry>> {
    return this.http.get<ApiResponse<Entry>>(`${this.apiService.base.v1}website/entry/`, {
      params: Object.assign(filter, {
        site: BlogService.currentBlog.id,
        limit: (filter.limit || EntryService.PAGE_SIZE).toString(),
        offset: UtilService.getPageOffset(filter.limit || EntryService.PAGE_SIZE, page),
      }),
    });
  }

  /**
   * Update an entry
   *
   * @param id Entry ID
   * @param payload Entry data
   */
  update(id: string, payload: { [field: string]: any }): Observable<Entry> {
    return this.http.patch<Entry>(`${this.apiService.base.v1}website/entry/${id}`, payload);
  }

  /**
   * Delete a entry
   *
   * @param id Entry ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiService.base.v1}website/entry/${id}`);
  }

  /**
   * Draft an entry
   *
   * @param title Entry title
   * @param content Entry content
   */
  draft(title: string, content: string): Observable<Entry> {
    return this.http.post<Entry>(`${this.apiService.base.v1}website/entry/`, {
      content,
      title,
      status: EntryStatus.Draft,
      site: BlogService.currentBlog.id,
    }).pipe(
      map((data: Entry): Entry => {
        this.toast.info(this.translate.instant('TOAST_CREATE'), title);
        return data;
      }),
    );
  }
}
