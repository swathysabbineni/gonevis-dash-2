import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SettingsBillingRoutingModule } from './settings-billing-routing.module';
import { SettingsBillingComponent } from './settings-billing.component';


@NgModule({
  declarations: [SettingsBillingComponent],
  imports: [
    CommonModule,
    SettingsBillingRoutingModule,
    TranslateModule.forChild(),
    ModalModule.forRoot(),
    FontAwesomeModule,
  ],
})
export class SettingsBillingModule {
}
