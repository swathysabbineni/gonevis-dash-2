import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ApiError } from '@app/interfaces/api-error';
import { AuthResponse } from '@app/interfaces/auth-response';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { UserService } from '@app/services/user/user.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
})
export class EmailConfirmationComponent implements OnInit {

  /**
   * API loading indicator
   */
  loading = true;

  /**
   * API errors
   */
  error: ApiError = {};

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.userService.verifyEmail(params.token).subscribe((data: AuthResponse): void => {
        UserService.user = data.user;
        this.router.navigate(AuthService.REDIRECT_SIGN_IN);
      }, (error: HttpErrorResponseApi): void => {
        this.error = error.error;
        this.loading = false;
      });
    });
  }
}
