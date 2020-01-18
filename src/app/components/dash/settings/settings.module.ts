import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { PermissionAccessModule } from '@app/shared/permission-access/permission-access.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SettingsAdvancedComponent } from './settings-advanced/settings-advanced.component';
import { SettingsAppearanceComponent } from './settings-appearance/settings-appearance.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';


@NgModule({
  declarations: [
    SettingsComponent,
    SettingsGeneralComponent,
    SettingsAppearanceComponent,
    SettingsAdvancedComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SettingsRoutingModule,
    FontAwesomeModule,
    CarouselModule,
    FileListModule,
    ModalModule.forRoot(),
    PermissionAccessModule,
  ],
})
export class SettingsModule {
}
