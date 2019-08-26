import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Nav } from '@app/interfaces/v1/nav';
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
   * Get blog navs
   */
  getNavs(): Observable<{navigation: Nav[]}> {
    return this.http.get<{navigation: Nav[]}>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/navigation/`
    );
  }

  /**
   * Update navigations
   *
   * @param navigation List of navigations to update
   */
  update(navigation: Nav[]): Observable<any> {
    const blogId: string = BlogService.currentBlog.id;
    return this.http.put(`${this.api.base.v1}website/site/${blogId}/update-navigation/`, { navigation });
  }
}
