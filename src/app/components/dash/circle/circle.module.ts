import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule.forChild(),
    ReactiveFormsModule,
    LoadingModule,
  ],
})
export class CircleModule {
}
