import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  readonly user: IconDefinition = faUser;
  readonly lock: IconDefinition = faLock;
  readonly faShowPassword: IconDefinition = faEyeSlash;

  // Sign in form
  form: FormGroup;

  // API errors
  error: ApiError = {};

  // API loading indicator
  loading: boolean;

  // Show password input
  showPassword: boolean;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    // Setup the form
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * @return Sign in form controls (fields)
   */
  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Sign user in
   */
  submit(): void {
    this.loading = true;
    // API call
    this.authService.signIn(this.f.username.value, this.f.password.value).subscribe((): void => {
      this.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.error = error.error;
      this.loading = false;
    });
  }
}
