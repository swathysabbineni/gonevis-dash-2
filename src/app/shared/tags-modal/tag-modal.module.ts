import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { TagModalComponent } from './tag-modal.component';

@NgModule({
  declarations: [
    TagModalComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FileListModule,
    TranslateModule.forChild(),
  ],
  entryComponents: [
    TagModalComponent,
  ],
})
export class TagModalModule {
}
