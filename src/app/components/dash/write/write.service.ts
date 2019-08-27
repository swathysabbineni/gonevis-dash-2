import { HttpClient, HttpParams, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/v1/entry';
import { Tag } from '@app/interfaces/v1/tag';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WriteService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get entry
   *
   * @param entryId Entry ID
   */
  getEntry(entryId: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiService.base.v1}website/entry/${entryId}/`);
  }

  /**
   * Update entry
   *
   * @param entryId Entry ID
   * @param entry Entry data
   */
  updateEntry(entryId: string, entry): Observable<Entry> {
    return this.http.put<Entry>(`${this.apiService.base.v1}website/entry/${entryId}/`, entry);
  }

  /**
   * Add entry
   */
  addEntry(entry: Entry): Observable<Entry> {
    return this.http.post<Entry>(`${this.apiService.base.v1}website/entry/`, entry);
  }


  /**
   * Get tags
   */
  getTags(): Observable<ApiResponse<Tag>> {
    const httpParams: HttpParams = new HttpParams()
      .set('site', BlogService.currentBlog.id);

    return this.http.get<ApiResponse<Tag>>(`${this.apiService.base.v1}tagool/tag/`, { params: httpParams });
  }

  /**
   * Get SoundCloud embed
   *
   * @param url SoundCloud URL
   */
  getSoundCloud(url: string): Observable<any> {
    const httpParams: HttpParams = new HttpParams()
      .set('format', 'js')
      .set('url', url)
      .set('iframe', 'true');

    return this.http.get(`https://soundcloud.com/oembed`, { params: httpParams });
  }
}
