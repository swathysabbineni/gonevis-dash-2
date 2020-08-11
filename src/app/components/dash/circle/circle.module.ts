import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InfoBannerModule } from '@app/shared/info-banner/info-banner.module';
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
    InfoBannerModule,
  ],
})
export class CircleModule {
}
