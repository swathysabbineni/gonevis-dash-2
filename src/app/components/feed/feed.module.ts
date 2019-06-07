import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntryListModule } from '@app/shared/entry-list/entry-list.module';
import { NavPillsModule } from '@app/shared/nav-pills/nav-pills.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBookmark } from '@fortawesome/free-regular-svg-icons/faBookmark';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { TranslateModule } from '@ngx-translate/core';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';

@NgModule({
  declarations: [FeedComponent],
  imports: [
    CommonModule,
    FeedRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    EntryListModule,
    NavPillsModule,
  ],
})
export class FeedModule {
  constructor() {
    library.add(faBookmark);
    library.add(faHashtag);
  }
}
