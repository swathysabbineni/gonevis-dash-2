import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderComponent } from 'src/app/components/dash/builder/builder.component';

import { BuilderRoutingModule } from './builder-routing.module';


@NgModule({
  declarations: [BuilderComponent],
  imports: [
    CommonModule,
    BuilderRoutingModule,
  ],
})
export class BuilderModule {
}
