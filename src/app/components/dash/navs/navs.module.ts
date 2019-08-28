import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons/faGripLinesVertical';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateModule } from '@ngx-translate/core';

import { NavsRoutingModule } from './navs-routing.module';
import { NavsComponent } from './navs.component';

@NgModule({
  declarations: [
    NavsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NavsRoutingModule,
    TranslateModule,
    FontAwesomeModule,
    FormsModule,
    DragDropModule,
  ],
})
export class NavsModule {
  constructor() {
    library.add(faGripLinesVertical);
    library.add(faPlus);
    library.add(faTrash);
  }
}
