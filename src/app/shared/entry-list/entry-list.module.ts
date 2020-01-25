import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmbedModule } from '@app/shared/embed/embed.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { ShareModule } from '@app/shared/share/share.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgStringPipesModule } from 'ngx-pipes';

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
    NgStringPipesModule,
  ],
  exports: [
    EntryListComponent,
  ],
})
export class EntryListModule {
}
