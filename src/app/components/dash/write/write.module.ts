import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WriteRoutingModule } from './write-routing.module';
import { WriteComponent } from './write.component';

@NgModule({
  declarations: [
    WriteComponent,
  ],
  imports: [
    CommonModule,
    WriteRoutingModule,
  ],
})
export class WriteModule {
}
