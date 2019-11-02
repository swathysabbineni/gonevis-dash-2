import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { TagModalModule } from '@app/shared/tags-modal/tag-modal.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';

@NgModule({
  declarations: [
    TagsComponent,
  ],
  imports: [
    CommonModule,
    TagsRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TagModalModule,
    FileListModule,
    PaginationModule.forRoot(),
    BsDropdownModule,
    LoadingModule,
  ],
})
export class TagsModule {
}
