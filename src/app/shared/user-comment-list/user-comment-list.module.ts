import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

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
    UserAvatarModule,
  ],
  exports: [
    UserCommentListComponent,
  ],
})
export class UserCommentListModule {
}
