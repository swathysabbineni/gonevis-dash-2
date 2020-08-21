import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';


@NgModule({
  declarations: [UserAvatarComponent],
  imports: [
    CommonModule,
  ],
  exports: [UserAvatarComponent],
})
export class UserAvatarModule {
}
