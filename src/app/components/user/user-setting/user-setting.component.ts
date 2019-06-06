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
  @ViewChild('fileElement') fileElement;

  /**
   * Change password form
   */
  form: FormGroup;

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
      this.loading = false;
    });
  }

  /**
   * @return Change password form controls (fields)
   */
  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * On file selected
   */
  onFileSelected(): void {
    if (!this.fileElement.nativeElement.files[0]) {
      return;
    }
    this.loading = true;
    const file: File = this.fileElement.nativeElement.files[0];
    // Create form data
    const formData: FormData = new FormData();
    formData.append('picture', file);
    formData.append('key', file.name);
    this.userService.uploadAvatar(formData).subscribe((data: UserSettingsPatch): void => {
      this.userAuth.media = data.media;
      this.user.media = data.media;
      this.authService.setAuthenticatedUser(this.userAuth);
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  /**
   * Update user
   *
   * @param removeAvatar Remove avatar
   */
  submit(removeAvatar?: boolean): void {
    const payload: UserSettingsPatch = {
      name: this.user.name,
      about: this.user.about,
      location: this.user.location,
      receive_email_notification: this.user.receive_email_notification,
    };
    if (removeAvatar) {
      this.user.media.picture = null;
      payload.picture = null;
    }
    this.loading = true;
    this.userService.updateProfile(payload).subscribe((data: UserSettingsPatch): void => {
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

  changePassword(): void {
    // Is a new password
    if (this.f.oldPassword.value === this.f.password.value) {
      this.translateService.get('ERROR_PASSWORD_SAME').subscribe((response: string): void => {
        this.error.non_field_errors = [response];
      });
      return;
    }
    // Check if Confirm new password and new password were matched, if so raise an error
    if (this.f.password.value !== this.f.confirmPassword.value) {
      this.translateService.get('ERROR_PASSWORD_MISMATCH').subscribe((response: string): void => {
        this.error.non_field_errors = [response];
      });
      return;
    }

    this.loading = true;
    this.userService.changePassword(
      this.f.oldPassword.value,
      this.f.password.value,
      this.f.confirmPassword.value,
    ).subscribe((data): void => {
      console.log(data);
    });
  }
}
