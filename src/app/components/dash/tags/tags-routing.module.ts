import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagsComponent } from './tags.component';

const routes: Routes = [{
  path: '',
  component: TagsComponent,
  data: {
    title: 'TAGS',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagsRoutingModule {
}
