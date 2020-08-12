import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MetricStatChartLineModule } from '@app/shared/metric-stat-chart-line/metric-stat-chart-line.module';
import { PermissionAccessModule } from '@app/shared/permission-access/permission-access.module';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  declarations: [
    StatisticsComponent,
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    TranslateModule.forChild(),
    BsDropdownModule,
    MetricStatChartLineModule,
    PermissionAccessModule,
  ],
})
export class StatisticsModule {
}
