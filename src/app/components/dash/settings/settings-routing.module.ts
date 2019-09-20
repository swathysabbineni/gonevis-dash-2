import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from '@app/components/dash/settings/settings.component';

import { SettingsAdvancedComponent } from './settings-advanced/settings-advanced.component';
import { SettingsAppearanceComponent } from './settings-appearance/settings-appearance.component';
import { SettingsBillingComponent } from './settings-billing/settings-billing.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';

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
    loadChildren: (): any => import('./settings-upgrade/settings-upgrade.module').then(m => m.SettingsUpgradeModule),
  }, {
    path: 'billing',
    loadChildren: () => import('./settings-billing/settings-billing.module').then(m => m.SettingsBillingModule),
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
}
