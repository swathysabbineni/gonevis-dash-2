import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Params } from '@app/interfaces/params';
import { SoundCloudEmbed } from '@app/interfaces/sound-cloud-embed';
import { Entry } from '@app/interfaces/v1/entry';
import { Tag } from '@app/interfaces/v1/tag';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WriteService {

  /**
   * Loaded libraries
   */
  private loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Load Quill styles
   *
   * @param url URL to load
   */
  private loadStyle(url: string): Observable<any> {
    if (this.loadedLibraries[url]) {
      return this.loadedLibraries[url].asObservable();
    }

    this.loadedLibraries[url] = new ReplaySubject();

    const style = this.document.createElement('link');
    style.type = 'text/css';
    style.href = url;
    style.rel = 'stylesheet';
    style.onload = () => {
      this.loadedLibraries[url].next();
      this.loadedLibraries[url].complete();
    };

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(style);

    return this.loadedLibraries[url].asObservable();
  }

  /**
   * Lazy load Quill styles
   */
  lazyLoadQuill(): Observable<any> {
    return this.loadStyle('assets/quill/quill.snow.min.css');
  }

  /**
   * Get entry
   *
   * @param entry Entry ID
   */
  getEntry(entry: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiService.base.v1}website/entry/${entry}/`);
  }

  /**
   * Update entry
   *
   * @param payload Payload
   */
  updateEntry(payload: Params): Observable<Entry> {
    return this.http.put<Entry>(`${this.apiService.base.v1}website/entry/${payload.id}/`, payload);
  }

  /**
   * Add entry
   */
  addEntry(entry: Entry): Observable<Entry> {
    return this.http.post<Entry>(`${this.apiService.base.v1}website/entry/`, entry);
  }

  /**
   * Delete entry
   *
   * @param entryId Entry ID
   */
  deleteEntry(entryId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiService.base.v1}website/entry/${entryId}/`);
  }

  /**
   * Get tags
   *
   * @param search Search text
   */
  getTags(search: string): Observable<ApiResponse<Tag>> {
    const httpParams: HttpParams = new HttpParams()
      .set('site', BlogService.currentBlog.id)
      .set('limit', '100')
      .set('search', search);

    return this.http.get<ApiResponse<Tag>>(`${this.apiService.base.v1}tagool/tag/`, { params: httpParams });
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
