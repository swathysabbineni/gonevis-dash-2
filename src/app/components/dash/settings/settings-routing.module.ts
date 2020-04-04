import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from '@app/components/dash/settings/settings.component';

import { AdvancedComponent } from 'src/app/components/dash/settings/advanced/advanced.component';
import { AppearanceComponent } from 'src/app/components/dash/settings/appearance/appearance.component';
import { GeneralComponent } from 'src/app/components/dash/settings/general/general.component';

const routes: Routes = [{
  path: '',
  component: SettingsComponent,
  children: [{
    path: 'general',
    component: GeneralComponent,
    data: { title: 'GENERAL' },
  }, {
    path: 'appearance',
    component: AppearanceComponent,
    data: { title: 'APPEARANCE' },
  }, {
    path: 'advanced',
    component: AdvancedComponent,
    data: { title: 'ADVANCED' },
  }, {
    path: 'upgrade',
    loadChildren: (): any => import('./settings-upgrade/settings-upgrade.module').then(m => m.SettingsUpgradeModule),
  }, {
    path: 'billing',
    loadChildren: () => import('src/app/components/dash/settings/billing/billing.module').then(m => m.BillingModule),
  }, {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'general',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
}
