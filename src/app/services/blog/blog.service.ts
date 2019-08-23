import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Metrics } from '@app/interfaces/v1/metrics';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { ApiService } from '@app/services/api/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  private static blogSubject: BehaviorSubject<BlogMin> = new BehaviorSubject<BlogMin>(null);

  static blog: Observable<BlogMin> = BlogService.blogSubject.asObservable();

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Update current blog
   *
   * @param blog Blog data
   */
  static set currentBlog(blog: BlogMin) {
    localStorage.setItem('blog', JSON.stringify(blog));
    BlogService.blogSubject.next(blog);
  }

  /**
   * @return Current blog
   */
  static get currentBlog(): BlogMin {
    return JSON.parse(localStorage.getItem('blog'));
  }

  /**
   * Get metrics
   */
  getMetrics(): Observable<Metrics> {
    return this.http.get<Metrics>(`${this.apiService.base.v1}website/site/${BlogService.currentBlog.id}`);
  }
}
