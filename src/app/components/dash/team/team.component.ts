import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '@app/components/dash/team/team.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiError } from '@app/interfaces/api-error';
import { Team } from '@app/interfaces/v1/team';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {

  readonly roleNames = TeamService.roleNames;
  readonly teamRoles = TeamRoles;

  /**
   * Icons
   */
  readonly trash: IconDefinition = faTrash;

  /**
   * Team members
   */
  team: Team;

  /**
   * Invite form
   */
  form: FormGroup;

  /**
   * Invite form API loading indicator
   */
  loading: boolean;

  /**
   * Invite form API errors
   */
  errors: ApiError = {};

  constructor(private teamService: TeamService,
              private translate: TranslateService,
              private formBuilder: FormBuilder,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    BlogService.blog.subscribe((blog: BlogMin): void => {
      if (blog) {
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
    });
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
        this.toast.info(this.translate.instant('TOAST_REMOVE'), this.translate.instant('TEAM_MEMBER'));
        this.getTeam();
      });
    } else {
      this.teamService.removePending(idOrEmail).subscribe((): void => {
        this.toast.info(this.translate.instant('TOAST_REMOVE'), this.form.value.email);
        this.getTeam();
      });
    }
  }

  /**
   * Invite team member
   */
  invite(): void {
    this.loading = true;
    this.teamService.invite(this.form.value.email, this.form.value.role).subscribe((): void => {
      this.loading = false;
      this.errors = {};
      this.form.controls.email.reset();
      this.toast.success(this.translate.instant('TOAST_INVITE'), this.form.value.email);
      this.getTeam();
    }, (error): void => {
      this.loading = false;
      this.errors = error.error;
    });
  }
}
