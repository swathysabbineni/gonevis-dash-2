import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { Subscription } from '@app/interfaces/subscription';
import { UpgradePlan } from '@app/interfaces/upgrade-plan';
import { UserAuth } from '@app/interfaces/user-auth';
import { Plan } from '@app/interfaces/v1/plan';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { environment } from '@environments/environment';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { BsModalService } from 'ngx-bootstrap';

import { PaymentValidationComponent } from './payment-validation/payment-validation.component';
import { SettingsUpgradeService } from './settings-upgrade.service';

declare var cp: any;

@Component({
  selector: 'app-settings-upgrade',
  templateUrl: './settings-upgrade.component.html',
  styleUrls: ['./settings-upgrade.component.scss'],
})
export class SettingsUpgradeComponent implements OnInit, OnDestroy {

  readonly dollarSign: IconDefinition = faDollarSign;
  readonly check: IconDefinition = faCheck;

  /**
   * Upgrade plans to show in view
   */
  readonly plans: UpgradePlan[] = [{
    name: 'Lite',
    sub: 'Basic plan',
    color: 'secondary',
    features: [
      '1 Team Member',
      '512 MB Storage',
      'GoNevis.com Sub-domain',
      'No Ads',
      'Unlimited Blogs',
      'Free Themes',
      'SEO Optimization',
      'Basic UI Customization',
      'Basic Media Library',
      'Your Own Logo',
    ],
  }, {
    name: 'Personal',
    sub: 'Personal plan',
    color: 'primary',
    features: [
      'Everything Above',
      '5 GB Storage',
      '5 Team Members',
      'Custom Domain',
      'Free Themes',
      'All Media Library',
      'No GoNevis.com Branding',
    ],
  }, {
    name: 'Professional',
    sub: 'Professional plan',
    color: 'success',
    features: [
      'Everything Above',
      '10 GB Storage',
      '25 Team Members',
      'Premium Themes',
      'Advanced UI Customization',
      'Google AdSense (Monetization)',
      'Your own Google Analytics',
      'Custom Footer',
    ],
  }];

  /**
   * Authenticated user
   */
  user: UserAuth;

  /**
   * Blog owner indicator
   */
  isOwner: boolean;

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
    this.settingsUpgradeService.loadScript();
  }

  ngOnInit(): void {
    /**
     * Get current user
     */
    UserService.userObservable.subscribe((data: UserAuth): UserAuth => this.user = data);
    BlogService.blog.pipe(untilComponentDestroyed(this)).subscribe((data: BlogMin): void => {
      if (data) {
        /**
         * Check to see if user's role is owner which owner can only upgrade plans
         */
        this.isOwner = data.role === TeamRoles.Owner;
        /**
         * Get current subscription plan
         */
        this.settingsUpgradeService.getSubscription().subscribe((response: {
          subscription: Subscription
        }): void => {
          this.subscription = response.subscription;
          if (response.subscription && response.subscription.active) {
            this.currentPlan = response.subscription.plan;
          }
        });
        /**
         * Get plan list and set the plans "plan" property
         */
        this.settingsUpgradeService.getPlans().subscribe((response: ApiResponse<Plan>): void => {
          for (const upgradePlan of this.plans) {
            const plan: Plan = response.results.find(item => item.name === upgradePlan.name);
            if (plan) {
              upgradePlan.plan = plan;
            }
          }
        });
      }
    });
  }

  /**
   * @param plan Plan to pay
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

  ngOnDestroy(): void {
  }
}
