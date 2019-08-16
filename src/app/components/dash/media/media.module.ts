import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';

import { MediaRoutingModule } from './media-routing.module';
import { MediaComponent } from './media.component';


@NgModule({
  declarations: [
    MediaComponent,
  ],
  imports: [
    CommonModule,
    MediaRoutingModule,
    FontAwesomeModule,
  ],
})
export class MediaModule {
  constructor() {
    library.add(faEllipsisV);
  }
}
