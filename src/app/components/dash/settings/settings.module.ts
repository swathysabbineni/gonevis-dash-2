import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SettingsAdvancedComponent } from './settings-advanced/settings-advanced.component';
import { SettingsAppearanceComponent } from './settings-appearance/settings-appearance.component';
import { SettingsBillingComponent } from './settings-billing/settings-billing.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsUpgradeComponent } from './settings-upgrade/settings-upgrade.component';
import { SettingsComponent } from './settings.component';


@NgModule({
  declarations: [
    SettingsComponent,
    SettingsGeneralComponent,
    SettingsAppearanceComponent,
    SettingsAdvancedComponent,
    SettingsUpgradeComponent,
    SettingsBillingComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SettingsRoutingModule,
  ],
})
export class SettingsModule {
}
