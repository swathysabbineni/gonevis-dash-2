import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CancelSubscriptionModule } from '@app/components/dash/settings/settings-billing/cancel-subscription/cancel-subscription.module';
import { SettingsBillingComponent } from '@app/components/dash/settings/settings-billing/settings-billing.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SettingsBillingRoutingModule } from 'src/app/components/dash/settings/settings-billing/settings-billing-routing.module';


@NgModule({
  declarations: [SettingsBillingComponent],
  imports: [
    CommonModule,
    SettingsBillingRoutingModule,
    TranslateModule.forChild(),
    CancelSubscriptionModule,
    ModalModule.forRoot(),
  ],
})
export class SettingsBillingModule {
}
