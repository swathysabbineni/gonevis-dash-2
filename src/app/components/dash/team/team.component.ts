import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamService } from '@app/components/dash/team/team.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiError } from '@app/interfaces/api-error';
import { UserAuth } from '@app/interfaces/user-auth';
import { Team } from '@app/interfaces/v1/team';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {

  readonly roleNames = TeamService.roleNames;
  readonly teamRoles = TeamRoles;

  readonly trash: IconDefinition = faTrash;

  /**
   * It's being used to check if the member who's being removed is the same as logged in user.
   */
  readonly user: UserAuth = UserService.user;

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

  /**
   * Determines whether or not the user's role in current blog is editor
   */
  isEditor: boolean;

  constructor(private teamService: TeamService,
              private router: Router,
              private userService: UserService,
              private translate: TranslateService,
              private formBuilder: FormBuilder,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.isEditor = BlogService.currentBlog.role === TeamRoles.Editor;
    if (this.isEditor) {
      return;
    }
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
    if (idOrEmail === this.user.id) {
      if (!confirm(this.translate.instant('CONFORM_REMOVE_TEAM_SELF'))) {
        return;
      }
    } else {
      if (!confirm(this.translate.instant('CONFORM_REMOVE_TEAM'))) {
        return;
      }
    }
    if (!isPending) {
      this.teamService.remove(idOrEmail).subscribe((): void => {
        /**
         * Remove current blog from the user's blog list and redirect user to first blog if the user leaves team,
         * otherwise retrieve team list again to refresh the list.
         */
        if (idOrEmail === this.user.id) {
          BlogService.blogs = this.user.sites
            .filter((blog: BlogMin): boolean => blog.id !== BlogService.currentBlog.id);
          this.router.navigateByUrl('/');
          this.toast.info(this.translate.instant('TOAST_REMOVED_SELF'));
        } else {
          this.toast.info(this.translate.instant('TOAST_REMOVE'), this.translate.instant('TEAM_MEMBER'));
          this.getTeam();
        }
      });
    } else {
      this.teamService.removePending(idOrEmail).subscribe((): void => {
        this.toast.info(this.translate.instant('INVITATION_REMOVED'));
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
