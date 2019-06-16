import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogComponent } from '@app/components/feed/blog/blog.component';
import { EntryListModule } from '@app/shared/entry-list/entry-list.module';

import { BlogRoutingModule } from './blog-routing.module';

@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    EntryListModule,
  ],
})
export class BlogModule {
}
