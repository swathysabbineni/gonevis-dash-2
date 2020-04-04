import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdvancedRoutingModule } from '@app/components/dash/settings/advanced/advanced-routing.module';
import { AdvancedComponent } from '@app/components/dash/settings/advanced/advanced.component';
import { LockedFeatureModule } from '@app/shared/locked-feature/locked-feature.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AdvancedComponent],
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
