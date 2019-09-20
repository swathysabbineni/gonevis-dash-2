import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelSubscriptionComponent } from '@app/components/dash/settings/settings-billing/cancel-subscription/cancel-subscription.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [CancelSubscriptionComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FontAwesomeModule,
  ],
  entryComponents: [CancelSubscriptionComponent],
})
export class CancelSubscriptionModule {
  constructor() {
    library.add(faTimes);
  }
}
