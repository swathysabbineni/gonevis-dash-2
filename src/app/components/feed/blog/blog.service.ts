import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogFeed } from '@app/interfaces/blog-feed';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get blog detail
   *
   * @param id Blog ID
   */
  getBlog(id: string): Observable<BlogFeed> {
    return this.http.get<BlogFeed>(`${this.apiService.base.zero}website/site/${id}`);
  }
}
