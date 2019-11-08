import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';

import { PaymentValidationComponent } from './payment-validation.component';

@NgModule({
  declarations: [
    PaymentValidationComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    LoadingModule,
  ],
  entryComponents: [
    PaymentValidationComponent,
  ],
})
export class PaymentValidationModule {
}
