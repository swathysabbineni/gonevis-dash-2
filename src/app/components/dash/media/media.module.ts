import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MediaRoutingModule } from './media-routing.module';
import { MediaComponent } from './media.component';


@NgModule({
  declarations: [
    MediaComponent,
  ],
  imports: [
    CommonModule,
    MediaRoutingModule,
  ],
})
export class MediaModule {
}
