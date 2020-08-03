import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Params } from '@app/interfaces/params';
import { SoundCloudEmbed } from '@app/interfaces/sound-cloud-embed';
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
   * @param entry Entry ID
   */
  getEntry(entry: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiService.base.v1}site/${BlogService.currentBlog.id}/entry/${entry}/`);
  }

  /**
   * Update entry
   *
   * @param payload Payload
   */
  updateEntry(payload: Params): Observable<Entry> {
    return this.http.patch<Entry>(
      `${this.apiService.base.v1}site/${BlogService.currentBlog.id}/entry/${payload.id}/`,
      payload,
    );
  }

  /**
   * Add entry
   */
  addEntry(entry: Params): Observable<Entry> {
    return this.http.post<Entry>(`${this.apiService.base.v1}site/${BlogService.currentBlog.id}/entry/`, entry);
  }

  /**
   * Delete entry
   *
   * @param entryId Entry ID
   */
  deleteEntry(entryId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiService.base.v1}site/${BlogService.currentBlog.id}/entry/${entryId}/`);
  }

  /**
   * Get tags
   *
   * @param search Search text
   */
  getTags(search: string): Observable<ApiResponse<Tag>> {
    const httpParams: HttpParams = new HttpParams()
      .set('limit', '100')
      .set('search', search);

    return this.http.get<ApiResponse<Tag>>(
      `${this.apiService.base.v1}site/${BlogService.currentBlog.id}/tagool/tag/`,
      {
        params: httpParams,
      },
    );
  }

  /**
   * Get SoundCloud embed
   *
   * @param url SoundCloud URL
   */
  getSoundCloud(url: string): Observable<SoundCloudEmbed> {
    const httpParams: HttpParams = new HttpParams()
      .set('format', 'json')
      .set('url', url)
      .set('iframe', 'true');

    return this.http.get<SoundCloudEmbed>('https://soundcloud.com/oembed', { params: httpParams });
  }

  /**
   * Get pasted image's Blob
   *
   * @param imageUrl Image URL
   */
  getPastedImage(imageUrl: string): Observable<Blob> {
    return this.http.get<Blob>(imageUrl, { responseType: 'blob' as 'json' });
  }
}
