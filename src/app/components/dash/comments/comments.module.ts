import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommentsComponent } from '@app/components/dash/comments/comments.component';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { PaginationModule } from '@app/shared/pagination/pagination.module';
import { SearchBarModule } from '@app/shared/search-bar/search-bar.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

import { CommentsRoutingModule } from './comments-routing.module';

@NgModule({
  declarations: [
    CommentsComponent,
  ],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    BsDropdownModule,
    LoadingModule,
    PaginationModule,
    SearchBarModule,
    UserAvatarModule,
  ],
})
export class CommentsModule {
}
