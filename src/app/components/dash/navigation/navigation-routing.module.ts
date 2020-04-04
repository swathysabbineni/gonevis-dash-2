import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavigationComponent } from 'src/app/components/dash/navigation/navigation.component';

const routes: Routes = [{
  path: '',
  component: NavigationComponent,
  data: {
    title: 'NAVIGATION',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavigationRoutingModule {
}
