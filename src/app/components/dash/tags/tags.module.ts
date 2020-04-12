import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FileSelectionModule } from '@app/shared/file-selection/file-selection.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { PaginationModule } from '@app/shared/pagination/pagination.module';
import { SearchBarModule } from '@app/shared/search-bar/search-bar.module';
import { TagModalModule } from '@app/shared/tags-modal/tag-modal.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

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
    BsDropdownModule,
    LoadingModule,
    PaginationModule,
    SearchBarModule,
    FileSelectionModule,
  ],
})
export class TagsModule {
}
