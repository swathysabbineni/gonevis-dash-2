import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from '@app/components/dash/settings/settings.component';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { LockedFeatureModule } from '@app/shared/locked-feature/locked-feature.module';
import { PermissionAccessModule } from '@app/shared/permission-access/permission-access.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SettingsRoutingModule } from './settings-routing.module';


@NgModule({
  declarations: [SettingsComponent],
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
    PopoverModule.forRoot(),
    PermissionAccessModule,
    LockedFeatureModule,
  ],
})
export class SettingsModule {
}
