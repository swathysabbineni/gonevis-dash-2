import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';
import { PaginationComponent } from './pagination.component';


@NgModule({
  declarations: [PaginationComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    TranslateModule,
  ],
  exports: [PaginationComponent, PaginatePipe],
})
export class PaginationModule {
}
