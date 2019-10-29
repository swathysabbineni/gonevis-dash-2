import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavsComponent } from './navs.component';

const routes: Routes = [{
  path: '',
  component: NavsComponent,
  data: {
    title: 'NAVIGATION',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavsRoutingModule {
}
