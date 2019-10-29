import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogComponent } from '@app/components/feed/blog/blog.component';
import { BlogListModule } from '@app/shared/blog-list/blog-list.module';
import { EntryListModule } from '@app/shared/entry-list/entry-list.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';

import { BlogRoutingModule } from './blog-routing.module';

@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    TranslateModule.forChild(),
    EntryListModule,
    BlogListModule,
    LoadingModule,
  ],
})
export class BlogModule {
}
