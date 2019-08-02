import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { UserAuth } from '@app/interfaces/user-auth';
import { UserSettings } from '@app/interfaces/user-settings';
import { UserSettingsPatch } from '@app/interfaces/user-settings-patch';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { UserService } from '@app/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  /**
   * List of accepted file formats for avatar selection
   */
  readonly acceptList = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

  /**
   * File input reference
   */
  @ViewChild('fileElement', { static: false }) fileElement;

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

  /**
   * User settings form
   */
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private translateService: TranslateService,
              private userService: UserService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    /**
     * Setup form
     */
    this.form = this.formBuilder.group({
      name: [],
      location: [],
      about: [],
      receive_email_notification: [],
    });
    /**
     * Get authenticated user
     */
    this.authService.user.subscribe((data: UserAuth): void => {
      this.userAuth = data;
    });
    /**
     * Get authenticated user settings data
     */
    this.userService.getUser().subscribe((data: UserSettings): void => {
      this.loading = false;
      this.user = data;
      /**
       * Setup form based on user
       */
      this.form.patchValue({
        name: data.name,
        location: data.location,
        about: data.about,
        receive_email_notification: data.receive_email_notification,
      });
    });
  }

  /**
   * @return Form controls
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
      name: this.f.name.value,
      about: this.f.about.value,
      location: this.f.location.value,
      receive_email_notification: this.f.receive_email_notification.value,
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
}
