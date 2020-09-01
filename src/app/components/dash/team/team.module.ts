import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { PermissionAccessModule } from '@app/shared/permission-access/permission-access.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team.component';

@NgModule({
  declarations: [
    TeamComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TeamRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    LoadingModule,
    PermissionAccessModule,
    UserAvatarModule,
  ],
})
export class TeamModule {
}
