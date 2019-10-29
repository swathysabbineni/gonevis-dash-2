import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsUpgradeComponent } from '@app/components/dash/settings/settings-upgrade/settings-upgrade.component';


const routes: Routes = [{
  path: '',
  component: SettingsUpgradeComponent,
  data: {
    title: 'UPGRADE',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsUpgradeRoutingModule {
}
