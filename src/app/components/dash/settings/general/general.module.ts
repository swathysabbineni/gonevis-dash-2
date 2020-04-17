import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LockedFeatureModule } from '@app/shared/locked-feature/locked-feature.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { GeneralRoutingModule } from './general-routing.module';
import { GeneralComponent } from './general.component';

@NgModule({
  declarations: [
    GeneralComponent,
  ],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    ReactiveFormsModule,
    LockedFeatureModule,
    FontAwesomeModule,
    PopoverModule.forRoot(),
    TranslateModule.forChild(),
  ],
})
export class GeneralModule {
}
