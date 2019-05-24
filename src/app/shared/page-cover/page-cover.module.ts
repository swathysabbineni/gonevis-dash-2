import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageCoverComponent } from '@app/shared/page-cover/page-cover.component';

@NgModule({
  declarations: [PageCoverComponent],
  imports: [
    CommonModule,
  ],
  exports: [PageCoverComponent],
})
export class PageCoverModule {
}
