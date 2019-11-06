import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from '@app/components/user/forgot-password/forgot-password.component';
import { PageCoverModule } from '@app/shared/page-cover/page-cover.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PageCoverModule,
    FontAwesomeModule,
  ],
})
export class ForgotPasswordModule {
}
