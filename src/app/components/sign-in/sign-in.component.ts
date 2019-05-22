import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  // Sign in form.
  signInForm: FormGroup;
  // Holds API errors.
  error: HttpErrorResponseApi;
  // This variable indicates whether user is signing in or not.
  loading: boolean;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    // Update loading state.
    this.loading = false;
  }

  ngOnInit() {
    // Setup login form.
    this.signInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * @return Sign in form controls (fields).
   */
  get form(): { [p: string]: AbstractControl } {
    return this.signInForm.controls;
  }

  /**
   * Sign in user
   */
  signIn(): void {
    // If sign in form is invalid, then prevent code from continuing.
    if (this.signInForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.signIn(
      this.form.username.value,
      this.form.password.value,
    ).subscribe((username: string): void => {
      this.loading = false;
    }, (errors: HttpErrorResponseApi): void => {
      this.error = errors;
      this.loading = false;
    });
  }
}
