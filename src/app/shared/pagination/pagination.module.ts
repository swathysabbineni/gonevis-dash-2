import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';
import { PaginationComponent } from './pagination.component';


@NgModule({
  declarations: [PaginationComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    TranslateModule.forChild(),
  ],
  exports: [PaginationComponent, PaginatePipe],
})
export class PaginationModule {
}
