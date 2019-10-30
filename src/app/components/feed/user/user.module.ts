import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlogListModule } from '@app/shared/blog-list/blog-list.module';
import { EntryListModule } from '@app/shared/entry-list/entry-list.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    TranslateModule.forChild(),
    EntryListModule,
    BlogListModule,
    LoadingModule,
  ],
})
export class UserModule {
}
