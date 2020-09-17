import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogPlanName } from '@app/enums/blog-plan-name';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { BlogCreate } from '@app/interfaces/blog-create';
import { UserAuth } from '@app/interfaces/user-auth';
import { Template } from '@app/interfaces/v1/template';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {

  /**
   * Regex for domain text.
   */
  private static readonly domainRegex: RegExp = new RegExp('^[a-zA-Z0-9\\-]+$');

  readonly arrowRight: IconDefinition = faArrowRight;
  readonly envelope: IconDefinition = faEnvelope;
  readonly lock: IconDefinition = faLock;
  readonly faBack: IconDefinition = faArrowLeft;

  /**
   * Current step of getting started
   */
  step: 'address' | 'theme' | 'register' = 'address';

  /**
   * Domain check control.
   */
  domainControl: FormControl;

  /**
   * Register form
   */
  registerForm: FormGroup;

  /**
   * Skip template selection step
   */
  skip: boolean;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * API errors
   */
  error: ApiError = {};

  /**
   * Templates to pick
   */
  templates: Template[];

  /**
   * Picked template
   */
  templateSelected: Template;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private blogService: BlogService,
              public authService: AuthService) {
  }

  /**
   * Validate domain name.
   *
   * @param control FormControl to validate.
   */
  private static ValidateDomain(control: AbstractControl): { [key: string]: any; } | null {
    /**
     * Raise require error.
     */
    if ((control.value || '').trim().length === 0) {
      return { required: true };
    }
    /**
     * Raise format error.
     */
    if (StartComponent.domainRegex.test(control.value.trim())) {
      return null;
    } else {
      return { invalidFormat: true };
    }
  }

  ngOnInit(): void {
    /**
     * Setup domain check control.
     */
    this.domainControl = new FormControl('', [Validators.required, StartComponent.ValidateDomain]);
    /**
     * Listen to domain query changes and conditionally check domain name.
     */
    this.domainControl.valueChanges
      .pipe(
        /**
         * Allow checking domain only if domain control is valid.
         */
        filter((): boolean => {
          if (this.domainControl.valid) {
            this.loading = true;
            return true;
          }
          return false;
        }),
        /**
         * Wait 500ms before checking domain.
         */
        debounceTime(500),
      ).subscribe((): void => {
      this.checkDomain();
    });
    /**
     * Setup register
     */
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
    /**
     * Get templates
     */
    this.blogService.getTemplates().subscribe((data: ApiResponse<Template>): void => {
      this.templates = data.results;
    });
  }

  /**
   * Domain availability checker
   */
  checkDomain(): void {
    this.loading = true;
    this.blogService.domainCheck(this.domainControl.value).subscribe((): void => {
      this.loading = false;
      this.error = {};
    }, error => {
      this.loading = false;
      this.error = error.error;
    });
  }

  /**
   * Final registration of the user and the new blog
   */
  register(): void {
    this.loading = true;
    this.authService.signUpWithBlog(
      this.registerForm.get('email').value,
      this.registerForm.get('password').value,
      this.domainControl.value,
      this.domainControl.value,
      this.templateSelected.id,
    ).subscribe(() => {
    }, error => {
      this.loading = false;
      this.error = error.error;
    });
  }

  /**
   * On template select
   *
   * @param template Blog template
   */
  onTemplateSelect(template: Template): void {
    this.templateSelected = template;
    /**
     * Create blog if user is authenticated, otherwise go to register step.
     */
    if (this.authService.isAuth) {
      this.createBlog();
    } else {
      this.step = 'register';
    }
  }

  /**
   * Create blog
   */
  createBlog(): void {
    this.loading = true;
    this.blogService.create(
      this.domainControl.value,
      this.domainControl.value,
    ).subscribe((data: BlogCreate): void => {
      this.loading = false;
      const user: UserAuth = UserService.user;
      const blog: BlogMin = {
        role: TeamRoles.Owner,
        title: data.title,
        url: data.url,
        id: data.id,
        plan_name: BlogPlanName.FREE,
        media: {
          logo: null,
        },
      };
      user.sites.unshift(blog);
      /**
       * Update authenticated user data
       */
      UserService.user = user;
      BlogService.blogs = user.sites;
      /**
       * Redirect to blog settings
       */
      this.router.navigate(['dash', BlogService.getBlogIndex(data.id), 'main']).then((): void => {
        /**
         * If user skipped or selected template was 'zero' then ignore setting blog template
         */
        if (this.templateSelected && this.templateSelected.name !== 'zero' && !this.skip) {
          this.setTemplate();
        }
      });
    }, (): void => {
      this.loading = false;
    });
  }

  /**
   * Set blog template
   */
  setTemplate(): void {
    this.loading = true;
    this.blogService.setTemplate(this.templateSelected.id).subscribe((): void => {
      this.loading = false;
    }, (): void => {
      this.loading = false;
    });
  }

  /**
   * Go to previous step
   */
  goBack(): void {
    switch (this.step) {
      case 'theme':
        this.step = 'address';
        break;
      case 'register':
        this.step = 'theme';
        break;
    }
  }
}
