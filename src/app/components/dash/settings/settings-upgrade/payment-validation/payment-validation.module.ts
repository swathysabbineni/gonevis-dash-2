import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentValidationComponent } from '@app/components/dash/settings/settings-upgrade/payment-validation/payment-validation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [PaymentValidationComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TranslateModule,
  ],
  entryComponents: [PaymentValidationComponent],
})
export class PaymentValidationModule {
  constructor() {
    library.add(faCircleNotch);
  }
}
