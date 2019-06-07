import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
   * File input reference
   */
  @ViewChild('fileElement') fileElement;

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
}
