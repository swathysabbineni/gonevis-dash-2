import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfoBannerModule } from '@app/shared/info-banner/info-banner.module';
import { LoadingModule } from '@app/shared/loading/loading.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { CircleCreateDialogModule } from 'src/app/components/dash/circle/circle-create-dialog/circle-create-dialog.module';
import { CircleEditDialogModule } from 'src/app/components/dash/circle/circle-edit-dialog/circle-edit-dialog.module';
import { ConfirmationDialogModule } from 'src/app/shared/confirmation-modal/confirmation-dialog.module';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

import { CircleRoutingModule } from './circle-routing.module';
import { CircleComponent } from './circle.component';

@NgModule({
  declarations: [
    CircleComponent,
  ],
  imports: [
    CommonModule,
    CircleRoutingModule,
    FontAwesomeModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    LoadingModule,
    InfoBannerModule,
    CircleCreateDialogModule,
    CircleEditDialogModule,
    ConfirmationDialogModule,
    MatDialogModule,
    MatRippleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatListModule,
    UserAvatarModule,
    MatTooltipModule,
  ],
})
export class CircleModule {
}
