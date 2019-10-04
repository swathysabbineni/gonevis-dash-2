import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersModalModule } from '@app/shared/users-modal/users-modal.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap';
import { NgMathPipesModule } from 'ngx-pipes';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    NgMathPipesModule,
    ModalModule.forRoot(),
    UsersModalModule,
  ],
})
export class MainModule {
  constructor() {
    library.add(faComment);
    library.add(faThumbsUp);
    library.add(faEye);
  }
}
