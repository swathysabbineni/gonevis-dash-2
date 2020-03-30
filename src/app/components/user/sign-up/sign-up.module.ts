import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageModalModule } from '@app/shared/message-modal/message-modal.module';
import { PageCoverModule } from '@app/shared/page-cover/page-cover.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { SignUpRoutingModule } from './sign-up-routing.module';
import { SignUpComponent } from './sign-up.component';

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SignUpRoutingModule,
    FontAwesomeModule,
    PageCoverModule,
    MessageModalModule,
  ],
})
export class SignUpModule {
}
