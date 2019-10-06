import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '@app/shared/share/share.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { FileModalComponent } from './file-modal.component';

@NgModule({
  declarations: [
    FileModalComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    PopoverModule.forRoot(),
    ShareModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    FileModalComponent,
  ],
})
export class FileModalModule {
}
