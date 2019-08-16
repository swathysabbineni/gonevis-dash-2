import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TeamRoles } from '@app/enums/team-roles';
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
  remove(id: string): Observable<void> {
    return this.http.put<void>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/remove-team-member/`, {
        team_member_id: id,
      },
    ).pipe();
  }

  /**
   * Remove pending blog team member
   *
   * @param email Team member email
   */
  removePending(email: string): Observable<void> {
    return this.http.put<void>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/remove-pending-member/`, { email },
    ).pipe();
  }

  /**
   * Invite team member
   *
   * @param email Team member role
   * @param role Team member role
   */
  invite(email: string, role: TeamRoles): Observable<Team> {
    return this.http.put<Team>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/promote-user/`, { email, role },
    ).pipe();
  }
}
