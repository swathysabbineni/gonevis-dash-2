import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TeamRoles } from '@app/enums/team-roles';
import { Team } from '@app/interfaces/team';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { TranslateService } from '@ngx-translate/core';
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
   * Invite new member
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
}
