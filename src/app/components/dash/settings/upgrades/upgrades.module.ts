import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UpgradesComponent } from '@app/components/dash/settings/upgrades/upgrades.component';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { UpgradesRoutingModule } from 'src/app/components/dash/settings/upgrades/upgrades-routing.module';


@NgModule({
  declarations: [UpgradesComponent],
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
