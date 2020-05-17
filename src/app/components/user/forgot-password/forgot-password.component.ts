import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { UserService } from '@app/services/user/user.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  readonly faEmail: IconDefinition = faEnvelope;
  readonly faSuccess: IconDefinition = faCheckCircle;

  // Forgot password form
  form: FormGroup;

  // API errors
  error: ApiError = {};

  // API loading indicator
  loading: boolean;

  // API success status
  success: boolean;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {
  }

  ngOnInit(): void {
    // Setup the form
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  /**
   * Send forgot password link
   */
  submit(): void {
    // Validate form
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    // API call
    this.userService.forgotPassword(this.form.controls.email.value).subscribe((): void => {
      this.loading = false;
      this.success = true;
    }, (error: HttpErrorResponseApi): void => {
      this.error = error.error;
      this.loading = false;
    });
  }
}
