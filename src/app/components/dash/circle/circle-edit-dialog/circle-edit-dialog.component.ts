import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CircleService } from 'src/app/components/dash/circle/circle.service';
import { ApiError } from 'src/app/interfaces/api-error';
import { ReactiveFormData } from 'src/app/interfaces/reactive-form-data';
import { CircleMin } from 'src/app/interfaces/v1/circle-min';
import { HttpErrorResponseApi } from 'src/app/models/http-error-response-api';

@Component({
  selector: 'app-circle-edit-dialog',
  templateUrl: './circle-edit-dialog.component.html',
})
export class CircleEditDialogComponent implements OnInit {

  /** Edit form. */
  form: ReactiveFormData = {
    error: {},
  };

  constructor(public dialogRef: MatDialogRef<CircleEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CircleMin,
              private formBuilder: FormBuilder,
              private circleService: CircleService) {
  }

  ngOnInit(): void {
    // Setup circle edit form.
    this.form.form = this.formBuilder.group({
      name: [this.data.name, Validators.required],
    });
  }

  /** Update circle name. */
  updateCircle(): void {
    // Prevent creation if form is invalid.
    // In other words if user didn't provide any name, prevent edition.
    if (this.form.form.invalid) {
      return;
    }
    // Forbid the user from closing the dialog, because we return the edition data after dialog is closed.
    this.dialogRef.disableClose = true;
    this.form.loading = true;
    this.circleService.update(this.data.id, this.form.form.value)
      .subscribe((data: CircleMin): void => {
        // Close dialog with new circle data.
        this.dialogRef.close(data);
        this.form.loading = false;
        this.dialogRef.disableClose = false;
      }, (error: HttpErrorResponseApi): void => {
        this.form.error = error.error;
        // If error is related to name field then mark name as invalid and show the error.
        if (this.form.error.name) {
          this.form.form.get('name').setErrors({ invalid: true });
          this.form.form.markAllAsTouched();
        }
        this.form.loading = false;
        // Allow the user to close the dialog.
        this.dialogRef.disableClose = false;
      });
  }
}
