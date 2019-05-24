import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from '@app/components/reset-password/reset-password.component';
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
  ],
})
export class ResetPasswordModule {
}
