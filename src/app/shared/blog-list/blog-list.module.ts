import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
    LoadingModule,
    FontAwesomeModule,
  ],
  exports: [
    BlogListComponent,
  ],
})
export class BlogListModule {
}
