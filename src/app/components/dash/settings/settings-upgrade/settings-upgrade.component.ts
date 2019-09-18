import { Component, OnInit } from '@angular/core';
import { PaymentValidationComponent } from '@app/components/dash/settings/settings-upgrade/payment-validation/payment-validation.component';
import { SettingsUpgradeService } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { Plan } from '@app/interfaces/plan';
import { Subscription } from '@app/interfaces/subscription';
import { UserAuth } from '@app/interfaces/user-auth';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { environment } from '@environments/environment';
import { BsModalService } from 'ngx-bootstrap';

declare var cp: any;

@Component({
  selector: 'app-settings-upgrade',
  templateUrl: './settings-upgrade.component.html',
  styleUrls: ['./settings-upgrade.component.scss'],
})
export class SettingsUpgradeComponent implements OnInit {

  /**
   * Authenticated user
   */
  user: UserAuth;

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
              private bsModalService: BsModalService,
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
   * @desc Payment
   *
   * @param plan Plan
   */
  pay(plan: Plan): void {
    /**
     * Prevent from upgrading to a same plan
     */
    if (this.currentPlan && this.currentPlan.id === plan.id || !this.isOwner) {
      return;
    }
    /**
     * Open payment widget
     */
    const payments = new cp.CloudPayments({ language: 'en-US' });
    payments.charge({
      publicId: environment.paymentPublicId,
      description: plan.description,
      amount: Number(plan.price),
      currency: 'USD',
      accountId: this.user.email,
      skin: 'modern',
      data: {
        plan_id: plan.id,
        site_id: BlogService.currentBlog.id,
        cloudPayments: {
          recurrent: {
            interval: 'Month',
            period: 1,
            customerReceipt: {
              Items: [{
                label: plan.name,
                price: plan.price,
                quantity: '1.00',
                amount: plan.price,
                vat: null,
                method: 4,
                object: 4,
              }],
              taxationSystem: 1,
              amounts: {
                electronic: plan.price,
                advancePayment: '0.00',
                credit: '0.00',
                provision: '0.00',
              },
            },
          },
        },
      },
    }, (): void => {
      this.bsModalService.show(PaymentValidationComponent);
    });
  }
}
