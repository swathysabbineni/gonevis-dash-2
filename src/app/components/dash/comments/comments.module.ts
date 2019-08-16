import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommentsComponent } from '@app/components/dash/comments/comments.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap';

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
  ],
})
export class CommentsModule {
  constructor() {
    library.add(faTrash);
    library.add(faEllipsisV);
    library.add(faEye);
  }
}
