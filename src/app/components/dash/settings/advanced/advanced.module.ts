import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LockedFeatureModule } from '@app/shared/locked-feature/locked-feature.module';
import { TranslateModule } from '@ngx-translate/core';

import { AdvancedRoutingModule } from './advanced-routing.module';
import { AdvancedComponent } from './advanced.component';

@NgModule({
  declarations: [
    AdvancedComponent,
  ],
  imports: [
    CommonModule,
    AdvancedRoutingModule,
    ReactiveFormsModule,
    LockedFeatureModule,
    TranslateModule.forChild(),
  ],
})
export class AdvancedModule {
}
