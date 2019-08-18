import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntryComponent } from 'src/app/components/dash/entry/entry.component';

const routes: Routes = [{
  path: '',
  component: EntryComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntryRoutingModule {
}
