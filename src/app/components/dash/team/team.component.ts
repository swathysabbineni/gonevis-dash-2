import { Component, OnInit } from '@angular/core';
import { TeamService } from '@app/components/dash/team/team.service';
import { Team } from '@app/interfaces/v1/team';
import { TeamMember } from '@app/interfaces/v1/team-member';
import { User } from '@app/interfaces/v1/user';
import { UserMin } from '@app/interfaces/v1/user-min';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {

  readonly roleNames = TeamService.roleNames;

  teams: Team;

  constructor(private teamService: TeamService) {
  }

  get members(): TeamMember<User | UserMin>[] {
    return this.teams.team.concat(this.teams.team_pending);
  }

  ngOnInit(): void {
    /**
     * Get teams
     */
    this.teamService.getTeams().subscribe((data: Team): void => {
      this.teams = data;
    });
  }
}
