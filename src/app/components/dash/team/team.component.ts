import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '@app/components/dash/team/team.service';
import { TeamRoles } from '@app/enums/team-roles';
import { Team } from '@app/interfaces/v1/team';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {

  readonly roleNames = TeamService.roleNames;
  readonly teamRoles = TeamRoles;

  /**
   * Team members
   */
  teams: Team;

  /**
   * Invite form
   */
  form: FormGroup;

  constructor(private teamService: TeamService,
              private translate: TranslateService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    /**
     * Setup Form
     */
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      role: [TeamRoles.Editor],
    });
    /**
     * Get teams
     */
    this.getTeams();
  }

  /**
   * Get teams
   */
  getTeams(): void {
    this.teamService.getTeams().subscribe((data: Team): void => {
      this.teams = data;
    });
  }

  /**
   * Remove team member
   *
   * @param id Team member ID
   */
  remove(id: string): void {
    if (!confirm(this.translate.instant('CONFORM_REMOVE_TEAM'))) {
      return;
    }
    this.teamService.removeTeamMember(id).subscribe();
  }

  /**
   * Invite team member
   */
  invite(): void {
    this.teamService.inviteMember(this.form.value.email, this.form.value.role).subscribe((dara) => {
      /**
       * Get teams
       */
      this.teamService.getTeams().subscribe((data: Team): void => {
        this.teams = data;
      });
      this.form.reset();
    });
  }
}
