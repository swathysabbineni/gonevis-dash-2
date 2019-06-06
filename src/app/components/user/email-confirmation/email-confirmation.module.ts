import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailConfirmationComponent } from '@app/components/user/email-confirmation/email-confirmation.component';

import { EmailConfirmationRoutingModule } from './email-confirmation-routing.module';

@NgModule({
  declarations: [EmailConfirmationComponent],
  imports: [
    CommonModule,
    EmailConfirmationRoutingModule,
  ],
})
export class EmailConfirmationModule {
}
