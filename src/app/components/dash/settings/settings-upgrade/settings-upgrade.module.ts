import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsUpgradeComponent } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
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
  constructor() {
    library.add(faStar);
    library.add(faDollarSign);
    library.add(faCheck);
  }
}
