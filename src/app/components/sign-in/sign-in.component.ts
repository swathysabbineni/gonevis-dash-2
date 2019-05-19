import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ApiError } from '../../interfaces/api-error';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  // Sign in form.
  signInForm: FormGroup;
  // Holds API errors.
  errors: ApiError = {};
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
      password: ['', Validators.required]
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
    // Update loading state.
    this.loading = true;
    // Set needed payload.
    const payload: { username: string, password: string } = {
      username: this.form.username.value,
      password: this.form.password.value
    };
    // API call.
    this.authService.signIn(payload).subscribe((username: string): void => {
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
