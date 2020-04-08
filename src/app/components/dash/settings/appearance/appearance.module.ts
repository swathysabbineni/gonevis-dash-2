import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileSelectionModule } from '@app/shared/file-selection/file-selection.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';

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
    ModalModule.forRoot(),
    FileSelectionModule,
    FormsModule,
  ],
})
export class AppearanceModule {
}
