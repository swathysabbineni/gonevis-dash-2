import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ShareComponent } from './share.component';

@NgModule({
  declarations: [
    ShareComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ShareComponent,
  ],
})
export class ShareModule {
}
