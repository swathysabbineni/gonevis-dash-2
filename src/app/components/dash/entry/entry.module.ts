import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EntryRoutingModule } from './entry-routing.module';
import { EntryComponent } from './entry.component';

@NgModule({
  declarations: [
    EntryComponent,
  ],
  imports: [
    CommonModule,
    EntryRoutingModule,
    TranslateModule.forChild(),
  ],
})
export class EntryModule {
}
