import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiError } from '@app/interfaces/api-error';
import { AuthResponse } from '@app/interfaces/auth-response';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { UserService } from '@app/services/user/user.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
})
export class EmailConfirmationComponent implements OnInit {

  /**
   * Danger icon
   */
  faExclamationTriangle: IconDefinition = faExclamationTriangle;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * API errors
   */
  error: ApiError = {};

  /**
   * Feed redirect
   */
  private readonly feedRoute: string = '/feed';

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.userService.verifyEmail(params.token).subscribe((data: AuthResponse): void => {
        this.loading = false;
        this.authService.setToken(data.token);
        AuthService.setAuthenticatedUser(data.user);
        this.router.navigateByUrl(this.feedRoute);
      }, (error: HttpErrorResponseApi): void => {
        this.error = error.error;
        this.loading = false;
      });
    });
  }

}
