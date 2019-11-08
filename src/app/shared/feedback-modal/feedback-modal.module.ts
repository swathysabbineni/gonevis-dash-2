import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedbackService } from '@app/services/feedback/feedback.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { FeedbackModalComponent } from './feedback-modal.component';

@NgModule({
  declarations: [
    FeedbackModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
  ],
  providers: [
    FeedbackService,
  ],
  entryComponents: [
    FeedbackModalComponent,
  ],
})
export class FeedbackModalModule {
}
