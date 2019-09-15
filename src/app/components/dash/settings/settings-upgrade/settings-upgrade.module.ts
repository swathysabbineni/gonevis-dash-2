import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsUpgradeComponent } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons/faDollarSign';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { TranslateModule } from '@ngx-translate/core';

import { SettingsUpgradeRoutingModule } from './settings-upgrade-routing.module';


@NgModule({
  declarations: [SettingsUpgradeComponent],
  imports: [
    CommonModule,
    SettingsUpgradeRoutingModule,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class SettingsUpgradeModule {
  constructor() {
    library.add(faStar);
    library.add(faDollarSign);
  }
}
