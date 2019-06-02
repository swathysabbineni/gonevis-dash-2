import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from '@app/components/user/reset-password/reset-password.component';
import { PageCoverModule } from '@app/shared/page-cover/page-cover.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    ResetPasswordRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    PageCoverModule,
  ],
})
export class ResetPasswordModule {
  constructor() {
    library.add(faLock);
  }
}
