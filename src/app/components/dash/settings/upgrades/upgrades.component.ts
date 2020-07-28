import { Component, OnInit, TemplateRef, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { PlanSubscription } from '@app/interfaces/planSubscription';
import { UpgradePlan } from '@app/interfaces/upgrade-plan';
import { UserAuth } from '@app/interfaces/user-auth';
import { Plan } from '@app/interfaces/v1/plan';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { environment } from '@environments/environment';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UpgradesService } from 'src/app/components/dash/settings/upgrades/upgrades.service';

declare var cp: any;

@Component({
  selector: 'app-settings-upgrade',
  templateUrl: './upgrades.component.html',
  styleUrls: ['./upgrades.component.scss'],
})
export class UpgradesComponent implements OnInit, OnDestroy {

  /**
   * Represents a disposable resource, such as the execution of an Observable.
   * A subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription.
   */
  private readonly subscription: Subscription = new Subscription();

  readonly dollarSign: IconDefinition = faDollarSign;
  readonly check: IconDefinition = faCheck;
  readonly circleNotch: IconDefinition = faCircleNotch;

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
    color: 'warning',
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
   * Get validation modal template reference
   */
  @ViewChild('validationModalTemplate') validationModalRef: TemplateRef<any>;

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
  planSubscription: PlanSubscription;

  /**
   * Current plan
   */
  currentPlan: Plan;

  /**
   * Selected plan to upgrade. It's being used to display the name of the plan in validation modal
   */
  selectedPlan: Plan;

  /**
   * Validation interval. It's being used to check whether or not payment is validated.
   */
  validationInterval: any;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private bsModalService: BsModalService,
              private upgradesService: UpgradesService,
              private userService: UserService) {
    this.upgradesService.loadScript();
    this.subscription.add(
      this.bsModalService.onHide.subscribe((): void => {
        clearInterval(this.validationInterval);
      }),
    );
  }

  ngOnInit(): void {
    /**
     * Get current user
     */
    UserService.userObservable.subscribe((data: UserAuth): UserAuth => this.user = data);
    /**
     * Check to see if user's role is owner which owner can only upgrade plans
     */
    this.isOwner = BlogService.currentBlog.role === TeamRoles.Owner;
    /**
     * Get current subscription plan
     */
    this.upgradesService.getSubscription().subscribe((response: {
      subscription: PlanSubscription
    }): void => {
      this.planSubscription = response.subscription;
      if (response.subscription && response.subscription.active) {
        this.currentPlan = response.subscription.plan;
      }
    });
    /**
     * Get plan list and set the plans "plan" property
     */
    this.upgradesService.getPlans().subscribe((response: ApiResponse<Plan>): void => {
      for (const upgradePlan of this.plans) {
        const plan: Plan = response.results.find(item => item.name === upgradePlan.name);
        if (plan) {
          upgradePlan.plan = plan;
        }
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
    this.selectedPlan = plan;
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
      /**
       * Show payment validation modal
       */
      const modal: BsModalRef = this.bsModalService.show(this.validationModalRef, {
        class: 'modal-sm',
        ignoreBackdropClick: true,
        keyboard: false,
      });

      this.validationInterval = setInterval((): void => {
        this.upgradesService.getSubscription().subscribe((data: { subscription: PlanSubscription }): void => {
          if (data.subscription && data.subscription.active) {
            // Refresh user.
            this.userService.getUser().subscribe();
            // Cancel interval
            clearInterval(this.validationInterval);
            // Close modal
            modal.hide();
            // Redirect to main page after 500 milliseconds
            this.router.navigate(['main'], {
              relativeTo: this.activatedRoute.root.firstChild.firstChild,
            });
          }
        });
      }, 2000);
    });
  }

  ngOnDestroy(): void {
    /**
     * Disposes the resources held by the subscription
     */
    this.subscription.unsubscribe();
  }
}
