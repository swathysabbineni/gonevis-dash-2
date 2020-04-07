import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { UpgradesRoutingModule } from './upgrades-routing.module';
import { UpgradesComponent } from './upgrades.component';

@NgModule({
  declarations: [
    UpgradesComponent,
  ],
  imports: [
    CommonModule,
    UpgradesRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    ModalModule.forRoot(),
    LoadingModule,
  ],
})
export class UpgradesModule {
}
