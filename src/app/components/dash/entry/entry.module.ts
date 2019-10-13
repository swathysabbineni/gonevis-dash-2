import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
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
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
  ],
})
export class EntryModule {
}
