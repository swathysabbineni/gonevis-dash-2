import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CircleRoutingModule } from './circle-routing.module';
import { CircleComponent } from './circle.component';

@NgModule({
  declarations: [
    CircleComponent,
  ],
  imports: [
    CommonModule,
    CircleRoutingModule,
    FontAwesomeModule,
  ],
})
export class CircleModule {
}
