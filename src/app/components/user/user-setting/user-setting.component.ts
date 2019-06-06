import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { UserAuth } from '@app/interfaces/user-auth';
import { UserSettings } from '@app/interfaces/user-settings';
import { UserSettingsPatch } from '@app/interfaces/user-settings-patch';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { UserService } from '@app/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
})
export class UserSettingComponent implements OnInit {

  /**
   * File input reference
   */
  @ViewChild('fileElement') fileElement;

  /**
   * Change password form
   */
  form: FormGroup;

  /**
   * Indicates password has changed succesfully
   */
  success: boolean;

  /**
   * List of accepted file formats for avatar selection
   */
  acceptList = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

  /**
   * User setting data to auto fill the inputs with
   */
  user: UserSettings;

  /**
   * Authenticated user data to update after settings changes
   */
  userAuth: UserAuth;

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
              private userService: UserService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    // Setup change password form
    this.form = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    // Get authenticated user data
    this.authService.user.subscribe((data: UserAuth): void => {
      this.userAuth = data;
    });
    // Get user settings data
    this.userService.getUser().subscribe((data: UserSettings): void => {
      this.loading = false;
      this.user = data;
    });
  }

  /**
   * @return Change password form controls (fields)
   */
  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * On file selected update user's picture
   */
  onFileSelected(): void {
    if (!this.fileElement.nativeElement.files[0]) {
      return;
    }
    this.loading = true;
    this.userService.setPicture(this.fileElement.nativeElement.files[0]).subscribe((data: UserSettingsPatch): void => {
      this.userAuth.media = data.media;
      this.user.media = data.media;
      this.authService.setAuthenticatedUser(this.userAuth);
      this.loading = false;
    });
  }

  /**
   * Update user
   *
   * @param removePicture Indicate whether to remove user picture or not
   */
  submit(removePicture: boolean = false): void {
    // Settings payload
    const payload: UserSettingsPatch = {
      name: this.user.name,
      about: this.user.about,
      location: this.user.location,
      receive_email_notification: this.user.receive_email_notification,
    };
    // If removing picture, remove it from payload
    if (removePicture) {
      this.user.media.picture = null;
      payload.picture = null;
    }
    this.loading = true;
    // API call
    this.userService.updateProfile(payload).subscribe((data: UserSettingsPatch): void => {
      // Update local user data with the new changes from back-end
      for (const key in data) {
        if (this.userAuth.hasOwnProperty(key)) {
          this.userAuth[key] = data[key];
        }
      }
      this.authService.setAuthenticatedUser(this.userAuth);
      this.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.error = error.error;
      this.loading = false;
    });
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
    this.userService.setPassword(
      this.f.oldPassword.value,
      this.f.password.value,
      this.f.confirmPassword.value,
    ).subscribe((): void => {
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
