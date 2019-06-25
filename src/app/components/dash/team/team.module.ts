import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TeamComponent } from '@app/components/dash/team/team.component';
import { TranslateModule } from '@ngx-translate/core';

import { TeamRoutingModule } from './team-routing.module';

@NgModule({
  declarations: [TeamComponent],
  imports: [
    CommonModule,
    TeamRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
})
export class TeamModule {
}
