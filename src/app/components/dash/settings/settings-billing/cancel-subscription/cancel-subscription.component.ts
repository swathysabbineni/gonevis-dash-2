import { Component, OnInit } from '@angular/core';
import { SettingsBillingService } from '@app/components/dash/settings/settings-billing/settings-billing.service';
import { Subscription } from '@app/interfaces/subscription';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html',
})
export class CancelSubscriptionComponent implements OnInit {

  /**
   * Subscription
   */
  subscription: Subscription;

  /**
   * Indicates cancelling process
   */
  cancelling: boolean;

  constructor(private bsModalRef: BsModalRef,
              private settingsBillingService: SettingsBillingService) {
  }

  ngOnInit(): void {
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.bsModalRef.hide();
  }
}
