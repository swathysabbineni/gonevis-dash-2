import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Circle } from '@app/interfaces/v1/circle';
import { CircleMin } from '@app/interfaces/v1/circle-min';
import { Subscriber } from '@app/interfaces/v1/subscriber';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CircleService {

  /**
   * API page size
   */
  static readonly PAGE_SIZE = 100;

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * List of circles of current blog
   */
  list(): Observable<ApiResponse<CircleMin>> {
    return this.http.get<ApiResponse<CircleMin>>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/sushial/circles/`,
    );
  }

  /**
   * Create a circle for the current bog
   *
   * @param payload Circle data
   */
  create(payload: Partial<Circle>): Observable<Circle> {
    return this.http.post<Circle>(`${this.api.base.v1}site/${BlogService.currentBlog.id}/sushial/circles/`, payload);
  }

  /**
   * Update a circle
   *
   * @param id Circle ID
   * @param payload Circle data
   */
  update(id: string, payload: Partial<CircleMin>): Observable<CircleMin> {
    return this.http.patch<CircleMin>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/sushial/circles/${id}/`,
      payload,
    );
  }

  /**
   * Delete a circle
   *
   * @param id Circle ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.base.v1}site/${BlogService.currentBlog.id}/sushial/circles/${id}/`);
  }

  /**
   * Get list of available members to add to circles
   */
  getAvailableMembers(search: string = ''): Observable<ApiResponse<Subscriber>> {
    return this.http.get<ApiResponse<Subscriber>>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/sushial/followers/`, { params: { search } },
    );
  }

  /**
   * Get list of members of a circle
   *
   * @param id Circle ID
   * @param filters API filters
   */
  getMembers(id: string, filters: { limit?: number, search?: string } = {}): Observable<ApiResponse<Subscriber>> {
    return this.http.get<ApiResponse<Subscriber>>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/sushial/followers/`, {
        params: Object.assign(filters, {
          circle_id: id,
          limit: (filters.limit || CircleService.PAGE_SIZE).toString(),
          site_id: BlogService.currentBlog.id,
        }),
      },
    );
  }

  /**
   * Add a member to a circle
   *
   * @param id Circle ID
   * @param member Member ID
   */
  addMember(id: string, member: string): Observable<{}> {
    return this.http.post<{}>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/sushial/circles/${id}/member/`,
      { subscription_id: member },
    );
  }

  /**
   * Remove a member from a circle
   *
   * @param id Circle ID
   * @param member Member ID
   */
  removeMember(id: string, member: string): Observable<void> {
    return this.http.delete<void>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/sushial/circles/${id}/member/${member}/`,
    );
  }
}
