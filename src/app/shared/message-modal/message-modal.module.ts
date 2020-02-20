import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MessageModalComponent } from './message-modal.component';

/**
 * @see MessageModalComponent
 */
@NgModule({
  declarations: [
    MessageModalComponent,
  ],
  entryComponents: [
    MessageModalComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
})
export class MessageModalModule {
}
