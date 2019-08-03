import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashRoutingModule } from './dash-routing.module';
import { DashComponent } from './dash.component';

@NgModule({
  declarations: [
    DashComponent,
  ],
  imports: [
    CommonModule,
    DashRoutingModule,
  ],
})
export class DashModule {
}
