import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReaderComponent } from '@app/components/feed/reader/reader.component';
import { EntryListModule } from '@app/shared/entry-list/entry-list.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { PostPanelModule } from '@app/shared/post-panel/post-panel.module';

import { ReaderRoutingModule } from './reader-routing.module';

@NgModule({
  declarations: [ReaderComponent],
  imports: [
    CommonModule,
    ReaderRoutingModule,
    EntryListModule,
    LoadingModule,
    PostPanelModule,
  ],
})
export class ReaderModule {
}
