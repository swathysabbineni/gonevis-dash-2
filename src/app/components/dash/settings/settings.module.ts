import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsAppearanceComponent } from './settings-appearance/settings-appearance.component';
import { SettingsAdvancedComponent } from './settings-advanced/settings-advanced.component';
import { SettingsUpgradeComponent } from './settings-upgrade/settings-upgrade.component';
import { SettingsBillingComponent } from './settings-billing/settings-billing.component';


@NgModule({
  declarations: [SettingsComponent, SettingsGeneralComponent, SettingsAppearanceComponent, SettingsAdvancedComponent, SettingsUpgradeComponent, SettingsBillingComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
