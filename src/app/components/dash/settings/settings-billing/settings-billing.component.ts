import { Component, OnInit } from '@angular/core';
import { CancelSubscriptionComponent } from '@app/components/dash/settings/settings-billing/cancel-subscription/cancel-subscription.component';
import { SettingsBillingService } from '@app/components/dash/settings/settings-billing/settings-billing.service';
import { SettingsUpgradeService } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { Subscription } from '@app/interfaces/subscription';
import { Transaction } from '@app/interfaces/transaction';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-settings-billing',
  templateUrl: './settings-billing.component.html',
  styleUrls: ['./settings-billing.component.scss'],
})
export class SettingsBillingComponent implements OnInit {

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * Blog owner indicator
   */
  isOwner: boolean;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Transactions list
   */
  transactions: Transaction[] = [];

  constructor(private bsModalService: BsModalService,
              private settingsUpgradeService: SettingsUpgradeService,
              private settingsBillingService: SettingsBillingService) {
  }

  ngOnInit(): void {
    /**
     * Check if owner
     */
    BlogService.blog.subscribe((data: BlogMin): void => {
      this.loading = true;
      if (data) {
        this.isOwner = data.role === TeamRoles.Owner;
        /**
         * Get current subscription
         */
        this.settingsUpgradeService.getSubscription().subscribe(
          (subscription: { subscription: Subscription }): void => {
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
    });
  }

  /**
   * Show cancel modal
   */
  showCancelModal(): void {
    this.bsModalService.show(CancelSubscriptionComponent, {
      initialState: { subscription: this.subscription },
    });
  }
}
