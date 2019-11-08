import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavPillsModule } from '@app/shared/nav-pills/nav-pills.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';

@NgModule({
  declarations: [
    FeedComponent,
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    NavPillsModule,
  ],
})
export class FeedModule {
}
