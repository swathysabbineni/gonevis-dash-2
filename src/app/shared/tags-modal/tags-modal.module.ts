import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TagsModalComponent } from './tags-modal.component';

@NgModule({
  declarations: [
    TagsModalComponent,
  ],
  imports: [
    CommonModule,
  ],
  entryComponents: [
    TagsModalComponent,
  ],
})
export class TagsModalModule {
}
