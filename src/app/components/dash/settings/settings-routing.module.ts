import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from '@app/components/dash/settings/settings.component';

const routes: Routes = [{
  path: '',
  component: SettingsComponent,
  children: [{
    path: 'general',
    loadChildren: (): any => import('./general/general.module').then(m => m.GeneralModule),
  }, {
    path: 'appearance',
    loadChildren: (): any => import('./appearance/appearance.module').then(m => m.AppearanceModule),
  }, {
    path: 'advanced',
    loadChildren: (): any => import('./advanced/advanced.module').then(m => m.AdvancedModule),
  }, {
    path: 'upgrade',
    loadChildren: (): any => import('./settings-upgrade/settings-upgrade.module').then(m => m.SettingsUpgradeModule),
  }, {
    path: 'billing',
    loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule),
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
