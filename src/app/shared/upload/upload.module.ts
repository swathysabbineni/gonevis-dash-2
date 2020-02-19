import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MediaService } from '@app/components/dash/media/media.service';
import { DragDropModule } from '@app/shared/drag-drop/drag-drop.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressbarModule } from 'ngx-bootstrap';

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
    DragDropModule,
    FontAwesomeModule,
    ProgressbarModule.forRoot(),
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
