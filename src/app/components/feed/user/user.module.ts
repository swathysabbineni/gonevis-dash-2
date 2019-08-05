import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntryListModule } from '@app/shared/entry-list/entry-list.module';
import { TranslateModule } from '@ngx-translate/core';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    EntryListModule,
    TranslateModule.forChild(),
  ],
})
export class UserModule {
}
