import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { CircleEditDialogComponent } from 'src/app/components/dash/circle/circle-edit-dialog/circle-edit-dialog.component';


@NgModule({
  declarations: [CircleEditDialogComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  exports: [CircleEditDialogComponent],
})
export class CircleEditDialogModule {
}
