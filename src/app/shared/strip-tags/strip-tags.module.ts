import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StripTagsPipe } from '@app/shared/strip-tags/strip-tags.pipe';


@NgModule({
  declarations: [StripTagsPipe],
  imports: [CommonModule],
  exports: [StripTagsPipe],
})
export class StripTagsModule {
}
