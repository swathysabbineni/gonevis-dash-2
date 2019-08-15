import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateModule } from '@ngx-translate/core';

import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team.component';

@NgModule({
  declarations: [
    TeamComponent,
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
  ],
})
export class TeamModule {
  constructor() {
    library.add(faEdit);
    library.add(faTrash);
  }
}
