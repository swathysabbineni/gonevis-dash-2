import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailConfirmationComponent } from '@app/components/user/email-confirmation/email-confirmation.component';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { EmailConfirmationRoutingModule } from './email-confirmation-routing.module';

@NgModule({
  declarations: [EmailConfirmationComponent],
  imports: [
    CommonModule,
    EmailConfirmationRoutingModule,
    LoadingModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
  ],
})
export class EmailConfirmationModule {
}
