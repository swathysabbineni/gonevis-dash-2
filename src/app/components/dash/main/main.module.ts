import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { MetricStatChartLineModule } from '@app/shared/metric-stat-chart-line/metric-stat-chart-line.module';
import { UsersModalModule } from '@app/shared/users-modal/users-modal.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    UsersModalModule,
    ReactiveFormsModule,
    LoadingModule,
    MetricStatChartLineModule,
    BsDropdownModule,
  ],
})
export class MainModule {
}
