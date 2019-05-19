import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiError } from '../../interfaces/api-error';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  // Sign up form.
  signUpForm: FormGroup;
  // Holds API errors.
  errors: ApiError = {};
  // This variable indicates whether user is signing up or not.
  loading: boolean;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    // Update loading state.
    this.loading = false;
  }

  ngOnInit() {
    // Setup sign up form.
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
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
    // Update loading state.
    this.loading = true;
    // Set needed payload.
    const payload: { email: string, username: string, password: string } = {
      email: this.form.email.value,
      username: this.form.username.value,
      password: this.form.password.value
    };
    // API call.
    this.authService.signUp(payload).subscribe((data: {username: string, email: string}): void => {
      // Update loading state.
      this.loading = false;
    }, (errors: ApiError): void => {
      // Set errors.
      this.errors = errors;
      // Update loading state.
      this.loading = false;
    });
  }
}
