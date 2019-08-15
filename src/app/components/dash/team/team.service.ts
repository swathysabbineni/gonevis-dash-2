import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Team } from '@app/interfaces/v1/team';
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
  getTeams(): Observable<Team> {
    return this.http.get<Team>(`${this.api.base.v1}website/site/${BlogService.currentBlog.id}/team/`, {
      params: { site: BlogService.currentBlog.id },
    });
  }

  /**
   * Remove blog team member
   *
   * @param id Team member ID
   */
  removeTeamMember(id: string): Observable<void> {
    return this.http.put<void>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/remove-team-member/`, {
        team_member_id: id,
      },
    ).pipe();
  }
}
