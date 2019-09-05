import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { TagsModalComponent } from './tags-modal.component';

@NgModule({
  declarations: [
    TagsModalComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  entryComponents: [
    TagsModalComponent,
  ],
})
export class TagsModalModule {
}
