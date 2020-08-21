import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmbedModule } from '@app/shared/embed/embed.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

import { UserVoteListComponent } from './user-vote-list.component';

@NgModule({
  declarations: [
    UserVoteListComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    InfiniteScrollModule,
    LoadingModule,
    RouterModule,
    EmbedModule,
    TooltipModule,
    FontAwesomeModule,
    UserAvatarModule,
  ],
  exports: [
    UserVoteListComponent,
  ],
})
export class UserVoteListModule {
}
