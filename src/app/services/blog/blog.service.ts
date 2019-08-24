import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@app/interfaces/params';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Domain } from '@app/interfaces/v1/domain';
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
              private api: ApiService) {
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
    const data: BlogMin = JSON.parse(localStorage.getItem('blog'));
    data.id = 'f089c2dc-ba37-4e53-b2d2-85ac26ca80bd';
    return data;
  }

  /**
   * Get blog settings
   *
   * @param blog Blog ID
   */
  getSettings(blog: string): Observable<BlogSettings> {
    return this.http.get<BlogSettings>(`${this.api.base.v1}website/site/${blog}/settings/`);
  }

  /**
   * Update blog settings
   *
   * @param blog Blog ID
   * @param payload Blog update data
   */
  updateSettings(blog: string, payload: Params): Observable<BlogSettings> {
    return this.http.put<BlogSettings>(`${this.api.base.v1}website/site/${blog}/update-settings/`, payload);
  }

  /**
   * Add blog domain
   * Note that this endpoint returns a structure that is useless so we set it as `void`.
   *
   * @param blog Blog ID
   * @param domain Domain address
   */
  addDomain(blog: string, domain: string): Observable<void> {
    return this.http.put<void>(`${this.api.base.v1}website/site/${blog}/set-custom-domain/`, { domain });
  }

  /**
   * Remove blog domain
   *
   * @param blog Blog ID
   * @param domain Domain ID
   */
  removeDomain(blog: string, domain: number): Observable<void> {
    return this.http.put<void>(`${this.api.base.v1}website/site/${blog}/remove-custom-domain/`, {
      domain_id: domain,
    });
  }
}
