import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from '@app/components/dash/settings/billing/billing.component';


const routes: Routes = [{
  path: '',
  component: BillingComponent,
  data: {
    title: 'BILLING',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {
}
