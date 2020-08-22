import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CircleService } from 'src/app/components/dash/circle/circle.service';
import { ApiError } from 'src/app/interfaces/api-error';
import { CircleMin } from 'src/app/interfaces/v1/circle-min';
import { HttpErrorResponseApi } from 'src/app/models/http-error-response-api';

@Component({
  selector: 'app-circle-edit-dialog',
  templateUrl: './circle-edit-dialog.component.html',
})
export class CircleEditDialogComponent implements OnInit {

  /**
   * Name control to edit circle name.
   */
  nameControl: FormControl;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * API errors.
   */
  error: ApiError = {};

  constructor(public dialogRef: MatDialogRef<CircleEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CircleMin,
              private circleService: CircleService) {
  }

  ngOnInit(): void {
    this.nameControl = new FormControl(this.data.name, Validators.required);
  }

  /**
   * Update circle name.
   */
  updateCircle(): void {
    /**
     * Prevent code from continuing if {@link nameControl} is invalid.
     */
    if (this.nameControl.invalid) {
      return;
    }
    this.dialogRef.disableClose = true;
    this.loading = true;
    this.circleService.update(this.data.id, { name: this.nameControl.value })
      .subscribe((data: CircleMin): void => {
        this.dialogRef.close(data);
        this.loading = false;
        this.dialogRef.disableClose = false;
      }, (error: HttpErrorResponseApi): void => {
        this.error = error.error;
        /**
         * If error is related to name field then mark {@link nameControl} as invalid and show the error.
         */
        if (this.error.name) {
          this.nameControl.setErrors({ invalid: true });
          this.nameControl.markAllAsTouched();
        }
        this.loading = false;
        this.dialogRef.disableClose = false;
      });
  }
}
