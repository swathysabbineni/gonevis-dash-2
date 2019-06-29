import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashComponent } from '@app/components/dash/dash.component';

import { DashRoutingModule } from './dash-routing.module';

@NgModule({
  declarations: [DashComponent],
  imports: [
    CommonModule,
    DashRoutingModule,
  ],
})
export class DashModule {
}
