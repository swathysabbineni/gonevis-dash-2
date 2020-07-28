import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MediaService } from '@app/components/dash/media/media.service';
import { DragDropModule } from '@app/shared/drag-drop/drag-drop.module';
import { LockedFeatureModule } from '@app/shared/locked-feature/locked-feature.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

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
    LockedFeatureModule,
    FormsModule,
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
