import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { PaginationModule } from '@app/shared/pagination/pagination.module';
import { SearchBarModule } from '@app/shared/search-bar/search-bar.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
    FontAwesomeModule,
    BsDropdownModule,
    TooltipModule.forRoot(),
    FormsModule,
    LoadingModule,
    SearchBarModule,
    PaginationModule,
  ],
})
export class EntryModule {
}
