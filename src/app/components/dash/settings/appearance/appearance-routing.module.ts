import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppearanceComponent } from './appearance.component';

const routes: Routes = [{
  path: '',
  component: AppearanceComponent,
  data: {
    title: 'APPEARANCE',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppearanceRoutingModule {
}
