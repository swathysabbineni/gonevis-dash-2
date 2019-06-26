import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '@app/components/dash/team/team.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiError } from '@app/interfaces/api-error';
import { Params } from '@app/interfaces/params';
import { Team } from '@app/interfaces/team';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {

  /**
   * Team members
   */
  team: Team;

  /**
   * API errors
   */
  error: ApiError = {};

  /**
   * Team roles
   */
  roles: { color: string, label: string }[] = [];

  /**
   * Invite form
   */
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private translateService: TranslateService,
              private teamService: TeamService) {
    this.translateService.get(['OWNER', 'ADMINISTRATOR', 'EDITOR']).subscribe((translate: Params): void => {
      this.roles.push({
        color: 'text-primary',
        label: translate.OWNER as string,
      }, {
        color: 'text-info',
        label: translate.ADMINISTRATOR as string,
      }, {
        color: 'text-warning',
        label: translate.EDITOR as string,
      });
    });
  }

  ngOnInit(): void {
    /**
     * Setup invite form
     */
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      role: [TeamRoles.EDITOR, Validators.required],
    });
    this.getTeam();
  }

  /**
   * @return Invite form controls (fields)
   */
  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Get team members
   */
  getTeam(): void {
    this.teamService.getTeam().subscribe((data: Team): void => {
      this.team = data;
    });
  }

  invite(): void {
    // Validate form
    if (this.form.invalid) {
      return;
    }
    this.teamService.inviteMember(this.f.email.value, this.f.role.value).subscribe((): void => {
      this.getTeam();
    }, (error: HttpErrorResponseApi): void => {
      this.error = error.error;
    });
  }

  /**
   * Get team statuses
   */
  teamRoles() {
    return TeamRoles;
  }
}
