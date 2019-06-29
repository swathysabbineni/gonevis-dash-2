import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TeamRoles } from '@app/enums/team-roles';
import { Params } from '@app/interfaces/params';
import { Team } from '@app/interfaces/team';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get team members
   */
  getTeam(): Observable<Team> {
    return this.http.get<Team>(`${this.apiService.base.v1}website/site/${BlogService.currentBlog.id}/team/`);
  }

  /**
   * Invite new member or promote a member
   *
   * @param email Email address
   * @param role Member's role in blog
   */
  teamPromote(email: string, role: TeamRoles): Observable<void> {
    return this.http.put<void>(`${this.apiService.base.v1}website/site/${BlogService.currentBlog.id}/promote-user/`, {
      email,
      role,
    });
  }

  /**
   * Remove member from team
   *
   * @param payload Payload required to remove member
   * @param isPending Determines whether member is pending or not
   */
  removeMember(payload: Params, isPending: boolean): Observable<void> {
    const blogId: string = BlogService.currentBlog.id;
    let endpoint = 'remove-team-member';
    // Check if member is pending
    if (isPending) {
      endpoint = 'remove-pending-member';
    }
    return this.http.put<void>(`${this.apiService.base.v1}website/site/${blogId}/${endpoint}/`, payload);
  }
}
