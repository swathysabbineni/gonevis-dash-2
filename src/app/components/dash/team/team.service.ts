import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teams } from '@app/interfaces/v1/teams';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamService {

  /**
   * Team role names
   */
  static readonly roleNames: string[] = [
    'Owner',
    'Administrator',
    'Editor',
  ];

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * Get blog teams
   */
  getTeams(): Observable<Teams> {
    return this.http.get<Teams>(`${this.api.base.v1}tagool/tag`, {
      params: { site: BlogService.currentBlog.id },
    });
  }
}
