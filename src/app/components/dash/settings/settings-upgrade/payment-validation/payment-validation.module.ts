import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { TranslateModule } from '@ngx-translate/core';

import { PaymentValidationComponent } from './payment-validation.component';

@NgModule({
  declarations: [
    PaymentValidationComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TranslateModule,
  ],
  entryComponents: [
    PaymentValidationComponent,
  ],
})
export class PaymentValidationModule {
  constructor() {
    library.add(faCircleNotch);
  }
}
