import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { BlogListComponent } from './blog-list.component';

@NgModule({
  declarations: [
    BlogListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    InfiniteScrollModule,
  ],
  exports: [
    BlogListComponent,
  ],
})
export class BlogListModule {
}
