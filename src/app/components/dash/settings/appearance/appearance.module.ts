import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileListModule } from '@app/shared/file-list/file-list.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { AppearanceRoutingModule } from './appearance-routing.module';
import { AppearanceComponent } from './appearance.component';

@NgModule({
  declarations: [
    AppearanceComponent,
  ],
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
