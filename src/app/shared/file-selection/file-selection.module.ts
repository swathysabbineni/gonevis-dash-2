import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { UploadModule } from '@app/shared/upload/upload.module';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'ngx-bootstrap';
import { FileSelectionComponent } from './file-selection.component';


@NgModule({
  declarations: [FileSelectionComponent],
  imports: [
    CommonModule,
    UploadModule,
    FileListModule,
    TabsModule.forRoot(),
    TranslateModule.forChild(),
  ],
  entryComponents: [FileSelectionComponent],
})
export class FileSelectionModule {
}
