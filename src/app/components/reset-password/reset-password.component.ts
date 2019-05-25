import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiError } from '@app/interfaces/api-error';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { UserService } from '@app/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  // Reset password token
  token: string;

  // Reset password form
  form: FormGroup;

  // API errors
  error: ApiError = {};

  // API loading indicator
  loading: boolean;

  // Sign in route
  readonly signInRoute: string = '/sign-in';

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
    });
    // Setup the form
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }

  /**
   * @return Reset password form controls (fields)
   */
  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Reset password
   */
  submit(): void {
    // Validate form
    if (this.form.invalid) {
      return;
    }
    // If password 1 and password 2 were not equal, then set error.
    if (this.f.password.value !== this.f.password2.value) {
      this.translateService.get('ERROR_PASSWORD_MISMATCH').subscribe((response: string): void => {
        this.error.non_field_errors = [response];
      });
      return;
    }
    // Save token to reset password
    this.authService.setToken(this.token);
    this.loading = true;
    // API call
    this.userService.resetPassword(this.f.password.value).subscribe((): void => {
      this.authService.signOut();
      this.router.navigateByUrl(this.signInRoute);
      this.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.error = error.error;
      this.loading = false;
    });
  }
}
