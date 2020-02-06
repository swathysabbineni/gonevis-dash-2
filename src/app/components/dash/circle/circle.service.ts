import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Circle } from '@app/interfaces/v1/circle';
import { CircleMin } from '@app/interfaces/v1/circle-min';
import { Subscriber } from '@app/interfaces/v1/subscriber';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CircleService {

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * List of circles of current blog
   */
  list(): Observable<CircleMin[]> {
    return this.http.get<{ circles: CircleMin[] }>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/circles/`,
    ).pipe(map((data: { circles: CircleMin[] }): CircleMin[] => {
      return data.circles;
    }));
  }

  /**
   * Create a circle for the current bog
   *
   * @param payload Circle data
   */
  create(payload: Partial<Circle>): Observable<Circle> {
    payload.site = BlogService.currentBlog.id;
    return this.http.post<Circle>(`${this.api.base.v1}sushial/circles/`, payload);
  }

  /**
   * Update a circle
   *
   * @param id Circle ID
   * @param payload Circle data
   */
  update(id: string, payload: Partial<Circle>): Observable<Circle> {
    return this.http.patch<Circle>(`${this.api.base.v1}sushial/circles/${id}/`, payload);
  }

  /**
   * Delete a circle
   *
   * @param id Circle ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.base.v1}sushial/circles/${id}/`);
  }

  /**
   * Get list of members of a circle
   * @param id Circle ID
   */
  getMembers(id: string): Observable<ApiResponse<Subscriber>> {
    return this.http.get<ApiResponse<Subscriber>>(
      `${this.api.base.zero}website/site/${BlogService.currentBlog.id}/subscribers/`, {
        params: { circle_id: id },
      },
    );
  }

  /**
   * Add a member to a circle
   *
   * @param id Circle ID
   * @param member Member ID
   */
  addMember(id: string, member: string): Observable<any> {
    return this.http.post<any>(`${this.api.base.v1}sushial/circles/${id}/`, { member });
  }

  /**
   * Remove a member from a circle
   *
   * @param id Circle ID
   * @param member Member ID
   */
  removeMember(id: string, member: string): Observable<any> {
    return this.http.delete<void>(`${this.api.base.v1}sushial/circles/${id}/`);
  }
}
