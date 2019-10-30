import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmbedModule } from '@app/shared/embed/embed.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { ShareModule } from '@app/shared/share/share.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBookmark } from '@fortawesome/free-regular-svg-icons/faBookmark';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faShareSquare } from '@fortawesome/free-regular-svg-icons/faShareSquare';
import { faHeart as faHeartFill } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkFill } from '@fortawesome/free-solid-svg-icons/faBookmark';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { EntryListComponent } from './entry-list.component';

@NgModule({
  declarations: [
    EntryListComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot(),
    InfiniteScrollModule,
    PopoverModule.forRoot(),
    ShareModule,
    EmbedModule,
    LoadingModule,
  ],
  exports: [
    EntryListComponent,
  ],
})
export class EntryListModule {
  constructor() {
    library.add(faHeart);
    library.add(faHeartFill);
    library.add(faComment);
    library.add(faEye);
    library.add(faBookmark);
    library.add(faBookmarkFill);
    library.add(faShareSquare);
    library.add(faStar);
    library.add(faHashtag);
  }
}
