import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageCoverModule } from '@app/shared/page-cover/page-cover.module';
import { PasswordStrengthModule } from '@app/shared/password-strength/password-strength.module';
import { TranslateModule } from '@ngx-translate/core';

import { UserPasswordRoutingModule } from './user-password-routing.module';
import { UserPasswordComponent } from './user-password.component';

@NgModule({
  declarations: [
    UserPasswordComponent,
  ],
  imports: [
    CommonModule,
    UserPasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PageCoverModule,
    PasswordStrengthModule,
  ],
})
export class UserPasswordModule {
}
