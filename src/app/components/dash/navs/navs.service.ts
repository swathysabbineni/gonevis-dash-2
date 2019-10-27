import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Navigation } from '@app/interfaces/v1/navigation';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavsService {

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * Get blog navigation
   */
  getNavs(): Observable<{ navigation: Navigation[] }> {
    return this.http.get<{ navigation: Navigation[] }>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/navigation/`,
    );
  }

  /**
   * Update navigation
   *
   * @param navigation List of navigation to update
   */
  update(navigation: Navigation[]): Observable<{ navigation: Navigation[] }> {
    return this.http.put<{ navigation: Navigation[] }>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/update-navigation/`, {
        navigation,
      },
    );
  }
}
