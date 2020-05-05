import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';
import { LineChartModule } from '@swimlane/ngx-charts';

import { MetricStatChartLineComponent } from './metric-stat-chart-line.component';

@NgModule({
  declarations: [
    MetricStatChartLineComponent,
  ],
  exports: [
    MetricStatChartLineComponent,
  ],
  imports: [
    CommonModule,
    LineChartModule,
    TranslateModule.forChild(),
    LoadingModule,
  ],
})
export class MetricStatChartLineModule {
}
