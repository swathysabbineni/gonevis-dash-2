import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordStrengthModule } from '@app/shared/password-strength/password-strength.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { StartRoutingModule } from './start-routing.module';
import { StartComponent } from './start.component';

@NgModule({
  declarations: [
    StartComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StartRoutingModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    PasswordStrengthModule,
  ],
})
export class StartModule {
}
