import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommentsComponent } from './comments.component';

const routes: Routes = [{
  path: '',
  component: CommentsComponent,
  data: {
    title: 'COMMENTS',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentsRoutingModule {
}
