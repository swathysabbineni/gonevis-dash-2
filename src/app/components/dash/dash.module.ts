import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';

import { DashRoutingModule } from './dash-routing.module';
import { DashComponent } from './dash.component';

@NgModule({
  declarations: [
    DashComponent,
  ],
  imports: [
    CommonModule,
    DashRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
  ],
})
export class DashModule {
}
