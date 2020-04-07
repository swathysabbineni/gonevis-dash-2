import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BillingRoutingModule } from 'src/app/components/dash/settings/billing/billing-routing.module';
import { BillingComponent } from 'src/app/components/dash/settings/billing/billing.component';


@NgModule({
  declarations: [BillingComponent],
  imports: [
    CommonModule,
    BillingRoutingModule,
    TranslateModule.forChild(),
    ModalModule.forRoot(),
    FontAwesomeModule,
  ],
})
export class BillingModule {
}
