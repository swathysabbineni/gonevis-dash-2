import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoResizeModule } from '@app/shared/auto-resize/auto-resize.module';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { TranslateModule } from '@ngx-translate/core';
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
    FileListModule,
    ModalModule.forRoot(),
    TextFieldModule,
    AutoResizeModule,
  ],
})
export class WriteModule {
}
