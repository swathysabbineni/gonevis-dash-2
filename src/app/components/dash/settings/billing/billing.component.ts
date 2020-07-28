import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillingService } from '@app/components/dash/settings/billing/billing.service';
import { UpgradesService } from '@app/components/dash/settings/upgrades/upgrades.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { PlanSubscription } from '@app/interfaces/planSubscription';
import { Transaction } from '@app/interfaces/transaction';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-settings-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {

  subscription: PlanSubscription;

  modal: BsModalRef;

  readonly times: IconDefinition = faTimes;
  readonly circleNotch: IconDefinition = faCircleNotch;

  /**
   * Indicates cancelling process
   */
  canceling: boolean;

  /**
   * Blog owner indicator
   */
  isOwner: boolean = BlogService.currentBlog.role === TeamRoles.Owner;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Transaction list
   */
  transactions: Transaction[] = [];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private bsModalService: BsModalService,
              private settingsUpgradeService: UpgradesService,
              private settingsBillingService: BillingService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.loading = true;
    /**
     * Get current subscription
     */
    this.settingsUpgradeService.getSubscription().subscribe(
      (subscription: { subscription: PlanSubscription }): void => {
        this.subscription = subscription.subscription;
        this.loading = false;
      });
    /**
     * Get transactions list
     */
    this.settingsBillingService.getTransactions().subscribe((transactions: ApiResponse<Transaction>): void => {
      this.transactions = transactions.results;
    });
  }

  /**
   * Cancel subscription
   */
  cancel(): void {
    this.canceling = true;
    this.settingsBillingService.cancelSubscription(this.subscription.id).subscribe((): void => {
      // Refresh user.
      this.userService.getUser().subscribe();
      this.router.navigate(['../upgrade'], {
        relativeTo: this.activatedRoute.parent,
      });
      this.modal.hide();
      this.canceling = false;
    }, (): void => {
      this.canceling = false;
    });
  }

  /**
   * Show cancel modal
   *
   * @param template Modal template
   */
  showModal(template: TemplateRef<any>): void {
    this.modal = this.bsModalService.show(template);
  }
}
