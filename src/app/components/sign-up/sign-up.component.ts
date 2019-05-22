import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError } from '@app/interfaces/api-error';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  // Sign up form
  signUpForm: FormGroup;

  // API errors
  error: ApiError = {};

  // API loading indicator
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    // Setup sign up form
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  /**
   * @return Sign up form controls (fields)
   */
  get f(): { [p: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  /**
   * Sign up user
   */
  submit(): void {
    // Validate form
    if (this.signUpForm.invalid) {
      return;
    }
    this.loading = true;
    // API call
    this.authService.signUp(
      this.f.email.value,
      this.f.username.value,
      this.f.password.value,
    ).subscribe((): void => {
      this.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.error = error.error;
      this.loading = false;
    });
  }
}
