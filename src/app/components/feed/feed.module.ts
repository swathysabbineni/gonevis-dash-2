import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBookmark, faComment, faHeart, faShareSquare } from '@fortawesome/free-regular-svg-icons';
import { faHeart as heartFill } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons/faStar';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap';

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
  ],
})
export class FeedModule {
  constructor() {
    library.add(faHeart);
    library.add(heartFill);
    library.add(faComment);
    library.add(faBookmark);
    library.add(faShareSquare);
    library.add(faStar);
    library.add(faHashtag);
  }
}
