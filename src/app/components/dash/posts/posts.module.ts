import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';

@NgModule({
  declarations: [
    PostsComponent,
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    TranslateModule,
  ],
})
export class PostsModule {
}
