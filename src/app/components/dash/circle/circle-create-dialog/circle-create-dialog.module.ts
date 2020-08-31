import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { CircleCreateDialogComponent } from 'src/app/components/dash/circle/circle-create-dialog/circle-create-dialog.component';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

@NgModule({
  declarations: [
    CircleCreateDialogComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatListModule,
    UserAvatarModule,
  ],
  entryComponents: [
    CircleCreateDialogComponent,
  ],
})
export class CircleCreateDialogModule {
}
