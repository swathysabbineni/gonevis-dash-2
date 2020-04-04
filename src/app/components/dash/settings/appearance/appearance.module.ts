import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppearanceComponent } from '@app/components/dash/settings/appearance/appearance.component';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-bootstrap';

import { AppearanceRoutingModule } from './appearance-routing.module';


@NgModule({
  declarations: [AppearanceComponent],
  imports: [
    CommonModule,
    AppearanceRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CarouselModule,
    FileListModule,
    FormsModule,
  ],
})
export class AppearanceModule {
}
