import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WriteComponent } from './write.component';

const routes: Routes = [{
  path: '',
  component: WriteComponent,
  children: [{
    path: ':id',
    component: WriteComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriteRoutingModule {
}
