import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-modal/confirmation-dialog.component';


@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [ConfirmationDialogComponent],
})
export class ConfirmationDialogModule {
}
