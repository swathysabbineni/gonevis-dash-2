import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

import { PostPanelComponent } from './post-panel.component';

@NgModule({
  declarations: [
    PostPanelComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    RouterModule,
    UserAvatarModule,
  ],
  exports: [
    PostPanelComponent,
  ],
})
export class PostPanelModule {
}
