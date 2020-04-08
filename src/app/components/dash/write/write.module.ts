import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSelectionModule } from '@app/shared/file-selection/file-selection.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
    ModalModule.forRoot(),
    TextFieldModule,
    FontAwesomeModule,
    AutosizeModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    FileSelectionModule,
  ],
})
export class WriteModule {
}
