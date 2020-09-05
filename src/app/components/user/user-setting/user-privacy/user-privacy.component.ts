import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormData } from '@app/interfaces/reactive-form-data';
import { UserSettings } from '@app/interfaces/user-settings';
import { UserSettingsPatch } from '@app/interfaces/user-settings-patch';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { FirebaseService } from '@app/services/firebase/firebase.service';
import { UserService } from '@app/services/user/user.service';

@Component({
  selector: 'app-user-privacy',
  templateUrl: './user-privacy.component.html',
  styleUrls: ['./user-privacy.component.scss'],
})
export class UserPrivacyComponent implements OnInit {

  /** Privacy form */
  form: ReactiveFormData = {
    error: {},
  };

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private firebaseService: FirebaseService) {
  }

  ngOnInit(): void {
    // Setup privacy form.
    this.form.form = this.formBuilder.group({
      fb_ga_web: [false],
      fb_perf_web: [false],
    });
    this.form.form.disable();
    this.form.loading = true;
    // Get authenticated user settings data.
    this.userService.getUser().subscribe((data: UserSettings): void => {
      this.form.loading = false;
      // Update privacy form with received data.
      this.form.form.setValue({
        fb_ga_web: data.privacy.fb_ga_web,
        fb_perf_web: data.privacy.fb_perf_web,
      });
      this.form.form.enable();
    });
  }

  /** Update changes */
  update(): void {
    this.form.loading = true;
    // API call
    this.userService.updateProfile({
      privacy: this.form.form.value,
    }).subscribe((data: UserSettingsPatch): void => {
      const userAuth = UserService.user;
      // Update local user data with the new changes from back-end
      userAuth.privacy.fb_ga_web = data.privacy.fb_ga_web;
      userAuth.privacy.fb_perf_web = data.privacy.fb_perf_web;
      // Enable or disable Firebase Performance Monitoring and Analytics based on updated privacy.
      this.firebaseService.enablePerformance(data.privacy.fb_perf_web);
      this.firebaseService.enableAnalytics(data.privacy.fb_ga_web);
      UserService.user = userAuth;
      this.form.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.form.error = error.error;
      this.form.loading = false;
    });
  }
}
