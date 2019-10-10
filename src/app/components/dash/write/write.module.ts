import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons/faNewspaper';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TranslateModule } from '@ngx-translate/core';
import { AutosizeModule } from 'ngx-autosize';
import { CollapseModule } from 'ngx-bootstrap/collapse';
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
  ],
})
export class WriteModule {
  constructor() {
    library.add(faCog);
    library.add(faTimes);
    library.add(faNewspaper);
    library.add(faAngleDown);
    library.add(faTags);
    library.add(faImage);
    library.add(faPlus);
  }
}
