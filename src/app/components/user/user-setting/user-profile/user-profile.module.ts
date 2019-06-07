import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from '@app/components/user/user-setting/user-profile/user-profile.component';
import { PageCoverModule } from '@app/shared/page-cover/page-cover.module';
import { TranslateModule } from '@ngx-translate/core';

import { UserProfileRoutingModule } from './user-profile-routing.module';

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PageCoverModule,
  ],
})
export class UserProfileModule {
}
