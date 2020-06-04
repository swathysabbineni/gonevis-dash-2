import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { ReaderCache } from '@app/interfaces/reader-cache';
import { Entry } from '@app/interfaces/zero/entry';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedService {

  /**
   * It's being used to cache data in reader pages (explore, updates and bookmarks).
   * The main purpose of it is when user clicks on a post to view the details, we cache the list
   * so when user navigates back to the reader page from the detail view,
   * everything will be there, such as: Scroll position and list of posts.
   *
   * This is a good way to keep the state from the point where user navigates to a detail page.
   */
  static readerCache: ReaderCache = {
    key: null,
    response: null,
    scrollTopPosition: null,
  };

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * Clear reader cache to prevent unwanted data from existing and to improve code performance.
   * Clearing cache is being used at multiple places so this method is here to also prevent duplicated codes.
   */
  static clearReaderCache(): void {
    FeedService.readerCache = {
      key: null,
      response: null,
      scrollTopPosition: null,
    };
  }

  /**
   * Get entries with filters
   */
  getEntries(params: {
    site_id?: string,
    username?: string,
    show?: 'feed' | 'bookmarked' | '',
    search?: string,
  } = {}): Observable<ApiResponse<Entry>> {
    return this.http.get<ApiResponse<Entry>>(`${this.api.base.zero}website/entry/`, { params });
  }
}
