import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  // Forgot password form
  form: FormGroup;

  // API errors
  error: ApiError = {};

  // API loading indicator
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit() {
    // Setup the form
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  /**
   * Send forgot password link.
   */
  submit(): void {
    // Validate form
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    // API call
    this.authService.forgotPassword(this.form.controls.email.value).subscribe((): void => {
      this.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.error = error.error;
      this.loading = false;
    });
  }
}
