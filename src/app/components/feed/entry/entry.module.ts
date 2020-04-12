import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryComponent } from '@app/components/feed/entry/entry.component';
import { CommentFormModule } from '@app/shared/comment-form/comment-form.module';
import { EntryListModule } from '@app/shared/entry-list/entry-list.module';
import { ShareModule } from '@app/shared/share/share.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { EntryRoutingModule } from './entry-routing.module';

@NgModule({
  declarations: [EntryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EntryRoutingModule,
    ShareModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    TranslateModule.forChild(),
    EntryListModule,
    CommentFormModule,
    InfiniteScrollModule,
  ],
})
export class EntryModule {
}
