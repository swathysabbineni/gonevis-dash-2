import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsBillingComponent } from '@app/components/dash/settings/settings-billing/settings-billing.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SettingsBillingRoutingModule } from 'src/app/components/dash/settings/settings-billing/settings-billing-routing.module';


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
