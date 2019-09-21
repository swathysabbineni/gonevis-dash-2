import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsBillingService } from '@app/components/dash/settings/settings-billing/settings-billing.service';
import { SettingsUpgradeService } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { Subscription } from '@app/interfaces/subscription';
import { Transaction } from '@app/interfaces/transaction';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

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
   * Cancel subscription modal reference
   */
  bsModalRef: BsModalRef;

  /**
   * Indicates cancelling process
   */
  cancelling: boolean;

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

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private bsModalService: BsModalService,
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
   * Cancel subscription
   */
  cancelSubscription(): void {
    this.cancelling = true;
    this.settingsBillingService.cancelSubscription(this.subscription.id).subscribe((): void => {
      this.router.navigate(['../upgrade'], {
        relativeTo: this.activatedRoute.parent,
      });
      this.bsModalRef.hide();
      this.cancelling = false;
    }, (): void => {
      this.cancelling = false;
    });
  }

  /**
   * Show cancel modal
   *
   * @param template Modal template
   */
  showCancelModal(template: TemplateRef<any>): void {
    this.bsModalRef = this.bsModalService.show(template);
  }
}
