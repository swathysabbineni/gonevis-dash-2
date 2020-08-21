import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogListModule } from '@app/shared/blog-list/blog-list.module';
import { UserCommentListModule } from '@app/shared/user-comment-list/user-comment-list.module';
import { EntryListModule } from '@app/shared/entry-list/entry-list.module';
import { UserVoteListModule } from '@app/shared/user-vote-list/user-vote-list.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    TranslateModule.forChild(),
    EntryListModule,
    BlogListModule,
    LoadingModule,
    UserVoteListModule,
    UserCommentListModule,
    UserAvatarModule,
  ],
})
export class UserModule {
}
