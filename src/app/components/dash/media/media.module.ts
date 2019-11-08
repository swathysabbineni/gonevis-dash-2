import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { UploadModule } from '@app/shared/upload/upload.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
    FileListModule,
  ],
})
export class MediaModule {
}
