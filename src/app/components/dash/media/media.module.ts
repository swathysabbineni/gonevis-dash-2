import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UploadModule } from '@app/shared/upload/upload.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap';

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
    BsDropdownModule,
    TranslateModule.forChild(),
    UploadModule,
  ],
})
export class MediaModule {
  constructor() {
    library.add(faEllipsisV);
  }
}
