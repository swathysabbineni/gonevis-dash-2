import { Component, OnInit } from '@angular/core';
import { SettingsUpgradeService } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { Plan } from '@app/interfaces/plan';
import { Subscription } from '@app/interfaces/subscription';
import { UserAuth } from '@app/interfaces/user-auth';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';

@Component({
  selector: 'app-settings-upgrade',
  templateUrl: './settings-upgrade.component.html',
  styleUrls: ['./settings-upgrade.component.scss'],
})
export class SettingsUpgradeComponent implements OnInit {

  /**
   * Blog owner indicator
   */
  isOwner: boolean;

  /**
   * Plans
   */
  plans: Plan[] = [];

  /**
   * Subscription
   */
  subscription: Subscription;

  /**
   * Current plan
   */
  currentPlan: Plan;

  constructor(private authService: AuthService,
              private settingsUpgradeService: SettingsUpgradeService) {
  }

  ngOnInit(): void {
    /**
     * Get current user
     */
    AuthService.user.subscribe((data: UserAuth): UserAuth => this.user = data);
    /**
     * Check if owner
     */
    BlogService.blog.subscribe((data: BlogMin): void => {
      if (data) {
        this.isOwner = data.role === TeamRoles.Owner;
        /**
         * Get current subscription
         */
        this.settingsUpgradeService.getSubscription().subscribe((data: { subscription: Subscription }): void => {
          this.subscription = data.subscription;
          if (data.subscription && data.subscription.active) {
            this.currentPlan = data.subscription.plan;
          }
        });

        /**
         * Get plans
         */
        this.settingsUpgradeService.getPlans().subscribe((plans: ApiResponse<Plan>): void => {
          this.plans = plans.results;
        });
      }
    });
  }

    /**
     * Get plans
     */
    this.settingsUpgradeService.getPlans().subscribe((plans: ApiResponse<Plan>): void => {
      this.plans = plans.results;
    });
  }
}
