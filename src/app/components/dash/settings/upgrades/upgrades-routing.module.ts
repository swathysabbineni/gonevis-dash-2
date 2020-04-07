import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpgradesComponent } from '@app/components/dash/settings/upgrades/upgrades.component';


const routes: Routes = [{
  path: '',
  component: UpgradesComponent,
  data: {
    title: 'UPGRADE',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpgradesRoutingModule {
}
