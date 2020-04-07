import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneralComponent } from '@app/components/dash/settings/general/general.component';
import { LockedFeatureModule } from '@app/shared/locked-feature/locked-feature.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap';

import { GeneralRoutingModule } from './general-routing.module';


@NgModule({
  declarations: [GeneralComponent],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    ReactiveFormsModule,
    LockedFeatureModule,
    FontAwesomeModule,
    PopoverModule,
    TranslateModule.forChild(),
  ],
})
export class GeneralModule {
}
