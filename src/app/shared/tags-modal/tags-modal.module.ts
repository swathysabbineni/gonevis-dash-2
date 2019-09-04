import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsModalComponent } from '@app/shared/tags-modal/tags-modal.component';



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
export class TagsModalModule { }
