import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
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
  constructor() {
    library.add(faCircleNotch);
  }
}
