import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { TooltipModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';

@NgModule({
  declarations: [FeedComponent],
  imports: [
    CommonModule,
    FeedRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot(),
    InfiniteScrollModule,
  ],
})
export class FeedModule {
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
