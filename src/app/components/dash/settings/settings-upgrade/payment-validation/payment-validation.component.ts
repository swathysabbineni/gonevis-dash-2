import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsUpgradeService } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.service';
import { Subscription } from '@app/interfaces/subscription';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-payment-validation',
  templateUrl: './payment-validation.component.html',
})
export class PaymentValidationComponent {

  /**
   * Interval
   */
  private readonly interval: number;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public modal: BsModalRef,
              private settingsUpgradeService: SettingsUpgradeService) {
    // Check if transaction is completed.
    this.interval = setInterval((): void => {
      this.settingsUpgradeService.getSubscription().subscribe((data: { subscription: Subscription }): void => {
        if (data.subscription.active) {
          // Cancel interval
          clearInterval(this.interval);
          // Close modal
          this.modal.hide();
          // Redirect to main page after 500 milliseconds
          this.router.navigate(['main'], {
            relativeTo: this.activatedRoute.root.firstChild.firstChild,
          });
        }
      });
    }, 2000);
  }

}
