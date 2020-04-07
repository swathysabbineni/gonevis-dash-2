import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionAccessModule } from '@app/shared/permission-access/permission-access.module';
import { TranslateModule } from '@ngx-translate/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    PermissionAccessModule,
    SettingsRoutingModule,
  ],
})
export class SettingsModule {
}
