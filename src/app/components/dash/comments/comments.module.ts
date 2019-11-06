import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommentsComponent } from '@app/components/dash/comments/comments.component';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { CommentsRoutingModule } from './comments-routing.module';

@NgModule({
  declarations: [
    CommentsComponent,
  ],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    BsDropdownModule,
    PaginationModule.forRoot(),
    LoadingModule,
  ],
})
export class CommentsModule {
}
