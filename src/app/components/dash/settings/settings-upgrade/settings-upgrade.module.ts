import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsUpgradeComponent } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaymentValidationModule } from './payment-validation/payment-validation.module';

import { SettingsUpgradeRoutingModule } from './settings-upgrade-routing.module';


@NgModule({
  declarations: [SettingsUpgradeComponent],
  imports: [
    CommonModule,
    SettingsUpgradeRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    ModalModule.forRoot(),
    PaymentValidationModule,
  ],
})
export class SettingsUpgradeModule {
}
