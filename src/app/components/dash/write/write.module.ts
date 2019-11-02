import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons/faNewspaper';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { TranslateModule } from '@ngx-translate/core';
import { AutosizeModule } from 'ngx-autosize';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { QuillModule } from 'ngx-quill';

import { WriteRoutingModule } from './write-routing.module';
import { WriteComponent } from './write.component';


@NgModule({
  declarations: [
    WriteComponent,
  ],
  imports: [
    CommonModule,
    WriteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    QuillModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    FileListModule,
    ModalModule.forRoot(),
    TextFieldModule,
    FontAwesomeModule,
    AutosizeModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
})
export class WriteModule {
  constructor() {
    library.add(faEye);
    library.add(faCog);
    library.add(faTimes);
    library.add(faNewspaper);
    library.add(faAngleDown);
    library.add(faHashtag);
    library.add(faImage);
    library.add(faPlus);
    library.add(faUndo);
    library.add(faCheck);
    library.add(faTrash);
  }
}
