import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UsersModalModule } from '@app/shared/users-modal/users-modal.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
}
