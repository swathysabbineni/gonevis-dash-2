import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { PopoverModule, ModalModule } from 'ngx-bootstrap';
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
    QuillModule.forRoot(),
    PopoverModule.forRoot(),
    FileListModule,
    ModalModule.forRoot(),
  ],
})
export class WriteModule {
}
