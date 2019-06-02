import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntryComponent } from '@app/components/feed/entry/entry.component';
import { EntryShareModule } from '@app/shared/entry-share/entry-share.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBookmark } from '@fortawesome/free-regular-svg-icons/faBookmark';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faShareSquare } from '@fortawesome/free-regular-svg-icons/faShareSquare';
import { faHeart as faHeartFill } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkFill } from '@fortawesome/free-solid-svg-icons/faBookmark';
import { PopoverModule, TooltipModule } from 'ngx-bootstrap';

import { EntryRoutingModule } from './entry-routing.module';

@NgModule({
  declarations: [EntryComponent],
  imports: [
    CommonModule,
    EntryRoutingModule,
    EntryShareModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
  ],
})
export class EntryModule {
  constructor() {
    library.add(faHeart);
    library.add(faHeartFill);
    library.add(faComment);
    library.add(faEye);
    library.add(faBookmark);
    library.add(faBookmarkFill);
    library.add(faShareSquare);
  }
}
