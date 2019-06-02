import { Component, OnInit } from '@angular/core';
import { ApiError } from '@app/interfaces/api-error';
import { User } from '@app/interfaces/user';
import { UserAuth } from '@app/interfaces/user-auth';
import { UserSettings } from '@app/interfaces/user-settings';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { UserService } from '@app/services/user/user.service';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
})
export class UserSettingComponent implements OnInit {

  user: User;
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
    this.userService.getUser().subscribe((data: User): void => {
      this.loading = false;
      this.user = data;
      this.loading = false;
    });
  }

  /**
   * Update user
   */
  submit(): void {
    this.loading = true;
    this.userService.updateProfile(
      this.user.about,
      this.user.location,
      this.user.name,
      this.user.receive_email_notification,
    ).subscribe((data: UserSettings): void => {
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
