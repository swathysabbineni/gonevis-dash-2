import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsBillingService } from '@app/components/dash/settings/settings-billing/settings-billing.service';
import { SettingsUpgradeService } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { Subscription } from '@app/interfaces/subscription';
import { Transaction } from '@app/interfaces/transaction';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-settings-billing',
  templateUrl: './settings-billing.component.html',
  styleUrls: ['./settings-billing.component.scss'],
})
export class SettingsBillingComponent implements OnInit {

  subscription: Subscription;

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
              private settingsUpgradeService: SettingsUpgradeService,
              private settingsBillingService: SettingsBillingService) {
  }

  ngOnInit(): void {
    this.loading = true;
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

  /**
   * Cancel subscription
   */
  cancel(): void {
    this.canceling = true;
    this.settingsBillingService.cancelSubscription(this.subscription.id).subscribe((): void => {
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
