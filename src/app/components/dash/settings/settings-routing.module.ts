import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from '@app/components/dash/settings/settings.component';

import { SettingsAdvancedComponent } from './settings-advanced/settings-advanced.component';
import { SettingsAppearanceComponent } from './settings-appearance/settings-appearance.component';
import { SettingsBillingComponent } from './settings-billing/settings-billing.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsUpgradeComponent } from './settings-upgrade/settings-upgrade.component';

const routes: Routes = [{
  path: '',
  component: SettingsComponent,
  children: [{
    path: '',
    redirectTo: 'general',
  }, {
    path: 'general',
    component: SettingsGeneralComponent,
  }, {
    path: 'appearance',
    component: SettingsAppearanceComponent,
  }, {
    path: 'advanced',
    component: SettingsAdvancedComponent,
  }, {
    path: 'upgrade',
    component: SettingsUpgradeComponent,
  }, {
    path: 'billing',
    component: SettingsBillingComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
}
