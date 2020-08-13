import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiError } from '@app/interfaces/api-error';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { UserService } from '@app/services/user/user.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  readonly faLock: IconDefinition = faLock;

  // Reset password token
  token: string;

  // Reset password form
  form: FormGroup;

  // API errors
  error: ApiError = {};

  // Token is not valid
  invalidToken: boolean;

  // API loading indicator
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private translateService: TranslateService,
              private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    // Subscribe to active route's params.
    this.activatedRoute.params.subscribe((params: Params): void => {
      // Get and set verification token from url query param.
      this.token = params.token;
      // Validate token
      if (!AuthService.parseJwt(this.token)) {
        this.invalidToken = true;
      }
    });
    // Setup the form
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }

  /**
   * Reset password
   */
  submit(): void {
    // If password 1 and password 2 were not equal, then set error
    if (this.form.get('password').value !== this.form.get('password2').value) {
      this.translateService.get('ERROR_PASSWORD_MISMATCH').subscribe((response: string): void => {
        this.error.non_field_errors = [response];
      });
      return;
    }
    // Save token to reset password
    this.loading = true;
    // API call
    this.userService.resetPassword(this.form.get('password').value, this.token).subscribe((): void => {
      this.authService.signOut(false, AuthService.REDIRECT_SIGN_OUT, true);
    }, (error: HttpErrorResponseApi): void => {
      if (error.error.detail) {
        this.invalidToken = true;
      }
      this.error = error.error;
      this.loading = false;
    });
  }
}
