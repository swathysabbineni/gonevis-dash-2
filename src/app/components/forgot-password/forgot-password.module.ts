import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from '@app/components/forgot-password/forgot-password.component';
import { TranslateModule } from '@ngx-translate/core';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
})
export class ForgotPasswordModule {
}
