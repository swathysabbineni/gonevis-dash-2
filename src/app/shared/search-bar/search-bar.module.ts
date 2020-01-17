import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { SearchBarComponent } from './search-bar.component';


@NgModule({
  declarations: [SearchBarComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [SearchBarComponent],
})
export class SearchBarModule {
}
