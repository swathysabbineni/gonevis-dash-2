import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TeamRoles } from '@app/enums/team-roles';
import { Team } from '@app/interfaces/v1/team';
import { TeamMember } from '@app/interfaces/v1/team-member';
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
    return this.http.get<Team>(`${ this.api.base.v1 }website/site/${ BlogService.currentBlog.id }/team/`, {
      params: {site: BlogService.currentBlog.id},
    });
  }

  /**
   * Remove blog team member
   *
   * @param id Team member ID
   */
  removeTeamMember(id: string): Observable<void> {
    return this.http.put<void>(
      `${ this.api.base.v1 }website/site/${ BlogService.currentBlog.id }/remove-team-member/`, {
        team_member_id: id,
      },
    ).pipe();
  }

  /**
   * Invite team member
   *
   * @param email Team member role
   * @param role Team member role
   */
  inviteMember(email: string, role: TeamRoles): Observable<Team> {
    return this.http.put<Team>(
      `${ this.api.base.v1 }website/site/${ BlogService.currentBlog.id }/promote-user/`,
      { email, role }
    ).pipe();
  }
}
