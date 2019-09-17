import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MediaService } from '@app/components/dash/media/media.service';
import { TranslateModule } from '@ngx-translate/core';

import { UploadComponent } from 'src/app/shared/upload/upload.component';

@NgModule({
  declarations: [
    UploadComponent,
    UploadComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
  providers: [
    MediaService,
  ],
  exports: [
    UploadComponent,
  ],
})
export class UploadModule {
}
