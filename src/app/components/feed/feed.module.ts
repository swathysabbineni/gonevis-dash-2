import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';

@NgModule({
  declarations: [FeedComponent],
  imports: [
    CommonModule,
    FeedRoutingModule,
  ],
})
export class FeedModule {
}
