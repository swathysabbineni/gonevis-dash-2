import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileModalModule } from '@app/shared/file-modal/file-modal.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { PaginationModule } from '@app/shared/pagination/pagination.module';
import { SearchBarModule } from '@app/shared/search-bar/search-bar.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FileListComponent } from './file-list.component';

@NgModule({
  declarations: [
    FileListComponent,
  ],
  exports: [
    FileListComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    ModalModule.forRoot(),
    BsDropdownModule,
    FileModalModule,
    PaginationModule,
    LoadingModule,
    SearchBarModule,
  ],
})
export class FileListModule {
}
