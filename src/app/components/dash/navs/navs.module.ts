import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NavsRoutingModule } from './navs-routing.module';
import { NavsComponent } from './navs.component';

@NgModule({
  declarations: [
    NavsComponent,
  ],
  imports: [
    CommonModule,
    NavsRoutingModule,
  ],
})
export class NavsModule {
}
