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
  team: Team;

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
     * Setup invite form
     */
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      role: [TeamRoles.Editor],
    });
    /**
     * Get teams
     */
    this.getTeam();
  }

  /**
   * Get teams
   */
  getTeam(): void {
    this.teamService.getTeams().subscribe((data: Team): void => {
      this.team = data;
    });
  }

  /**
   * Remove team member
   *
   * @param idOrEmail Team member ID or email for pending
   * @param isPending Is team member pending
   */
  remove(idOrEmail: string, isPending?: boolean): void {
    if (!confirm(this.translate.instant('CONFORM_REMOVE_TEAM'))) {
      return;
    }
    if (!isPending) {
      this.teamService.remove(idOrEmail).subscribe((): void => {
        this.getTeam();
      });
    } else {
      this.teamService.removePending(idOrEmail).subscribe((): void => {
        this.getTeam();
      });
    }
  }

  /**
   * Invite team member
   */
  invite(): void {
    this.teamService.invite(this.form.value.email, this.form.value.role).subscribe((): void => {
      this.form.controls.email.reset();
      this.getTeam();
    });
  }
}
