import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogService } from '@app/services/blog/blog.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

import { UsersModalComponent } from './users-modal.component';

@NgModule({
  declarations: [
    UsersModalComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    UserAvatarModule,
  ],
  providers: [
    BlogService,
  ],
  entryComponents: [
    UsersModalComponent,
  ],
})
export class UsersModalModule {
}
