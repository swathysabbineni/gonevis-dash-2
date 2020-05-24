import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { BuilderRoutingModule } from './builder-routing.module';
import { BuilderComponent } from './builder.component';

@NgModule({
  declarations: [
    BuilderComponent,
  ],
  imports: [
    CommonModule,
    BuilderRoutingModule,
    FontAwesomeModule,
    FormsModule,
  ],
})
export class BuilderModule {
}
