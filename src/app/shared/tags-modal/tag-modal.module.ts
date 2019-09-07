import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { TagModalComponent } from 'src/app/shared/tags-modal/tag-modal.component';

@NgModule({
  declarations: [
    TagModalComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  entryComponents: [
    TagModalComponent,
  ],
})
export class TagModalModule {
}
