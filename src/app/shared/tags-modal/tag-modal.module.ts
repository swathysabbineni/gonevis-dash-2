import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { TagModalComponent } from './tag-modal.component';

@NgModule({
  declarations: [
    TagModalComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
  entryComponents: [
    TagModalComponent,
  ],
})
export class TagModalModule {
}
