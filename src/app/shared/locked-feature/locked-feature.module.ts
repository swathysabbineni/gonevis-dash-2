import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { LockedFeatureComponent } from './locked-feature.component';

@NgModule({
  declarations: [
    LockedFeatureComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot(),
  ],
  exports: [
    LockedFeatureComponent,
  ],
})
export class LockedFeatureModule {
}
