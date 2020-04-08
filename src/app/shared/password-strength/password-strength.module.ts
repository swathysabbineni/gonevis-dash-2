import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordStrengthComponent } from '@app/shared/password-strength/password-strength.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
  declarations: [PasswordStrengthComponent],
  imports: [
    CommonModule,
    ProgressbarModule.forRoot(),
  ],
  exports: [PasswordStrengthComponent],
})
export class PasswordStrengthModule {
}
