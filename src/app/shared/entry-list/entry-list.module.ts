import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmbedModule } from '@app/shared/embed/embed.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { ShareModule } from '@app/shared/share/share.module';
import { StripTagsModule } from '@app/shared/strip-tags/strip-tags.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
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
    StripTagsModule,
  ],
  exports: [
    EntryListComponent,
  ],
})
export class EntryListModule {
}
