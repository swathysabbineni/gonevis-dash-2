import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersModalComponent } from '@app/shared/users-modal/users-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, ModalModule } from 'ngx-bootstrap';
import { NgMathPipesModule } from 'ngx-pipes';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [
    MainComponent,
    UsersModalComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    TranslateModule,
    FontAwesomeModule,
    NgMathPipesModule,
    ModalModule.forRoot(),
  ],
  entryComponents: [
    UsersModalComponent,
  ],
})
export class MainModule {
  constructor() {
    library.add(faTimes)
    library.add(faComment);
    library.add(faThumbsUp);
    library.add(faEye);
  }
}
