import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WriteComponent } from './write.component';

const routes: Routes = [{
  path: ':id',
  component: WriteComponent,
}, {
  path: '',
  redirectTo: 'new',
  pathMatch: 'full',
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriteRoutingModule {
}
