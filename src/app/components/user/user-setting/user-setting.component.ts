import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiError } from '@app/interfaces/api-error';
import { UserAuth } from '@app/interfaces/user-auth';
import { UserSettings } from '@app/interfaces/user-settings';
import { UserSettingsPatch } from '@app/interfaces/user-settings-patch';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { UserService } from '@app/services/user/user.service';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
})
export class UserSettingComponent implements OnInit {
  @ViewChild('fileElement') fileElement;

  /**
   * List of accepted file formats for avatar selection
   */
  acceptList = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

  user: UserSettings;
  userAuth: UserAuth;

  /**
   * API errors
   */
  error: ApiError = {};

  /**
   * API loading indicator
   */
  loading: boolean;

  constructor(private userService: UserService,
              private authService: AuthService) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.authService.user.subscribe((data: UserAuth): void => {
      this.userAuth = data;
    });
    this.userService.getUser().subscribe((data: UserSettings): void => {
      this.loading = false;
      this.user = data;
      this.loading = false;
    });
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
}
