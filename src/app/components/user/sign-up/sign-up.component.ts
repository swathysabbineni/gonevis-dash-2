import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiError } from '@app/interfaces/api-error';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { AuthService } from '@app/services/auth/auth.service';
import { MessageModalComponent } from '@app/shared/message-modal/message-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { BsModalService } from 'ngx-bootstrap/modal';

/**
 * Used for account registration only and start collaboration
 * @see view
 */
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  /**
   * Path to redirect to when collaboration link ({@see invite}) is invalid
   */
  private static readonly REDIRECT_ON_INVALID_LINK = '/user/sign-up';

  readonly user: IconDefinition = faUser;
  readonly lock: IconDefinition = faLock;
  readonly envelope: IconDefinition = faEnvelope;
  readonly faShowPassword: IconDefinition = faEyeSlash;

  /**
   * Sign up view
   */
  view: 'sign-up' | 'start-collaborating' = 'sign-up';

  /**
   * Invite ID in case of 'start-collaborating' view
   */
  invite: string;

  /**
   * Sign up form
   */
  form: FormGroup;

  /**
   * API errors
   */
  error: ApiError = {};

  /**
   * API loading indicator
   */
  loading: boolean;
  /**
   * Show password input
   */
  showPassword: boolean;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: BsModalService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    /**
     * Setup sign up form
     */
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    /**
     * Find what view is this
     */
    this.route.params.subscribe((data: Params): void => {
      /**
       * If there's an invite param
       */
      if (data.invite) {
        // Change view
        this.view = 'start-collaborating';
        // Set invite code
        this.invite = data.invite;
        // Remove email from control
        this.form.removeControl('email');
      }
    });
  }

  /**
   * Sign up user (registration or collaboration)
   */
  submit(): void {
    this.loading = true;
    /**
     * For payload, join the form and invite as well (it's ok if email or invite are null)
     * @see AuthService.signUp
     */
    this.authService.signUp({ ...this.form.value, ...{ invite_id: this.invite } }).subscribe((): void => {
      this.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.error = error.error;
      this.loading = false;
      /**
       * If there's any and only error about invite code,
       * show an error message in modal and redirect user to normal registration
       */
      if (this.error.invite_id && Object.keys(this.error).length === 1) {
        this.router.navigateByUrl(SignUpComponent.REDIRECT_ON_INVALID_LINK);
        this.modalService.show(MessageModalComponent, {
          initialState: {
            title: 'ERROR',
            messages: [...this.error.invite_id, 'TEXT_REDIRECTED_TO_SIGN_UP'],
            button: 'OK',
          },
          class: 'modal-sm',
        });
      }
    });
  }
}
