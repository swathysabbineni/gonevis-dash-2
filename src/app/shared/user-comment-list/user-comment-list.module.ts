import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { UserCommentListComponent } from './user-comment-list.component';

@NgModule({
  declarations: [
    UserCommentListComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    InfiniteScrollModule,
    RouterModule,
    TooltipModule,
    FontAwesomeModule,
  ],
  exports: [
    UserCommentListComponent,
  ],
})
export class UserCommentListModule {
}
