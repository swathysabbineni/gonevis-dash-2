import { Injectable } from '@angular/core';
import { BlogMinimalUser } from '@app/interfaces/blog-minimal-user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  /**
   * Current blog subject
   */
  private static blogSubject: BehaviorSubject<BlogMinimalUser> = new BehaviorSubject<BlogMinimalUser>(null);

  /**
   * Current blog
   */
  static blog: Observable<BlogMinimalUser> = BlogService.blogSubject.asObservable();

  constructor() {
  }

  /**
   * Update current blog
   *
   * @param blog Blog data
   */
  static set currentBlog(blog: BlogMinimalUser) {
    localStorage.setItem('blog', JSON.stringify(blog));
    BlogService.blogSubject.next(blog);
  }

  /**
   * @return Current blog
   */
  static get currentBlog(): BlogMinimalUser {
    return JSON.parse(localStorage.getItem('blog'));
  }
}
