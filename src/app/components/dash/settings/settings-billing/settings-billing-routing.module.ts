import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsBillingComponent } from '@app/components/dash/settings/settings-billing/settings-billing.component';


const routes: Routes = [{
  path: '',
  component: SettingsBillingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsBillingRoutingModule {
}
