import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { UserPrivacyRoutingModule } from './user-privacy-routing.module';
import { UserPrivacyComponent } from './user-privacy.component';


@NgModule({
  declarations: [UserPrivacyComponent],
  imports: [
    CommonModule,
    UserPrivacyRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
})
export class UserPrivacyModule {
}
