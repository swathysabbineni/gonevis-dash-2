import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { EntryRoutingModule } from './entry-routing.module';
import { EntryComponent } from './entry.component';

@NgModule({
  declarations: [
    EntryComponent,
  ],
  imports: [
    CommonModule,
    EntryRoutingModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    BsDropdownModule,
  ],
})
export class EntryModule {
  constructor() {
    library.add(
      faComment,
      faThumbsUp,
      faEye,
      faEllipsisV,
    );
  }
}
