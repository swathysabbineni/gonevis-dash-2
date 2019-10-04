import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { FileModalComponent } from './file-modal.component';

@NgModule({
  declarations: [
    FileModalComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
  ],
  entryComponents: [
    FileModalComponent,
  ],
})
export class FileModalModule {
}
