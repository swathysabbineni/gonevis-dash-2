import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  // Sign up form.
  signUpForm: FormGroup;
  // Holds API errors.
  error: HttpErrorResponseApi = null;
  // This variable indicates whether user is signing up or not.
  loading: boolean;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    // Update loading state.
    this.loading = false;
  }

  ngOnInit(): void {
    // Setup sign up form.
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * @return Sign up form controls (fields).
   */
  get form(): { [p: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  /**
   * Sign up user
   */
  signUp(): void {
    // If sign up form is invalid, then prevent code from continuing.
    if (this.signUpForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.signUp(
      this.form.email.value,
      this.form.username.value,
      this.form.password.value,
    ).subscribe((): void => {
      this.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.error = error;
      this.loading = false;
    });
  }
}
