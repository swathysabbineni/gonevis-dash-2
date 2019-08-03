import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommentsComponent } from '@app/components/dash/comments/comments.component';

import { CommentsRoutingModule } from './comments-routing.module';


@NgModule({
  declarations: [
    CommentsComponent,
  ],
  imports: [
    CommonModule,
    CommentsRoutingModule,
  ],
})
export class CommentsModule {
}
