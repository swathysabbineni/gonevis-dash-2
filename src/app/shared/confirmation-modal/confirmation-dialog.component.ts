import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogData } from '@app/interfaces/confirmation-dialog-data';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {
  }
}
