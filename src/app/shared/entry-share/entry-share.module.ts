import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryShareComponent } from '@app/shared/entry-share/entry-share.component';

@NgModule({
  declarations: [EntryShareComponent],
  imports: [
    CommonModule,
  ],
  exports: [EntryShareComponent],
})
export class EntryShareModule {
}
