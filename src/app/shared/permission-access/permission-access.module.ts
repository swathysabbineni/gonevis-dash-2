import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionAccessComponent } from './permission-access.component';


@NgModule({
  declarations: [PermissionAccessComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
  ],
  exports: [PermissionAccessComponent],
})
export class PermissionAccessModule {
}
