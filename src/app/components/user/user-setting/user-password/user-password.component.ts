import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { UserService } from '@app/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent implements OnInit {

  /**
   * Change password form
   */
  form: FormGroup;

  /**
   * Indicates password has changed successfully
   */
  success: boolean;

  /**
   * API errors
   */
  error: ApiError = {};

  /**
   * API loading indicator
   */
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private translateService: TranslateService,
              private userService: UserService) {
  }

  ngOnInit() {
    // Setup change password form
    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }


  /**
   * @return Change password form controls (fields)
   */
  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Change user password
   */
  changePassword(): void {
    // Is a new password
    if (this.f.oldPassword.value === this.f.password.value) {
      this.translateService.get('ERROR_PASSWORD_SAME').subscribe((response: string): void => {
        this.error.non_field_errors = [response];
      });
      return;
    }
    // Check if confirm new password and new password were matched, if so raise an error
    if (this.f.password.value !== this.f.confirmPassword.value) {
      this.translateService.get('ERROR_PASSWORD_MISMATCH').subscribe((response: string): void => {
        this.error.non_field_errors = [response];
      });
      return;
    }
    this.loading = true;
    // API call
    this.userService.setPassword(this.f.oldPassword.value, this.f.password.value, this.f.confirmPassword.value)
      .subscribe((): void => {
        this.error = {};
        this.loading = false;
        this.success = true;
        this.form.reset();
      }, (error: HttpErrorResponseApi): void => {
        this.error = error.error;
        this.loading = false;
      });
  }
}
