import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSettingRoutingModule } from '@app/components/user/user-setting/user-setting-routing.module';
import { UserSettingComponent } from '@app/components/user/user-setting/user-setting.component';
import { PageCoverModule } from '@app/shared/page-cover/page-cover.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UserSettingComponent],
  imports: [
    CommonModule,
    UserSettingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PageCoverModule,
  ],
})
export class UserSettingModule {
}
