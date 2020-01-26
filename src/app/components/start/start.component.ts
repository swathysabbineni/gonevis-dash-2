import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { BlogCreate } from '@app/interfaces/blog-create';
import { UserAuth } from '@app/interfaces/user-auth';
import { Template } from '@app/interfaces/v1/template';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {

  readonly arrowRight: IconDefinition = faArrowRight;
  readonly envelope: IconDefinition = faEnvelope;
  readonly lock: IconDefinition = faLock;
  readonly faBack: IconDefinition = faArrowLeft;

  /**
   * Current step of getting started
   */
  step: 'address' | 'theme' | 'register' = 'address';

  /**
   * Domain check form
   */
  domainCheckForm: FormGroup;

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
   * Used for debounce (delayed API call on input)
   */
  domainChanged: Subject<string> = new Subject<string>();

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

  ngOnInit(): void {
    /**
     * Setup domain check form
     */
    this.domainCheckForm = this.formBuilder.group({
      domain: [null, Validators.required],
    });
    /**
     * Setup register
     */
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
    /**
     * Domain change watch
     */
    this.domainChanged.pipe(debounceTime(500), distinctUntilChanged()).subscribe((): void => {
      this.checkDomain();
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
    this.blogService.domainCheck(this.domainCheckForm.get('domain').value).subscribe((): void => {
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
      this.domainCheckForm.get('domain').value,
      this.domainCheckForm.get('domain').value,
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
      this.domainCheckForm.get('domain').value,
      this.domainCheckForm.get('domain').value,
    ).subscribe((data: BlogCreate): void => {
      this.loading = false;
      const user: UserAuth = JSON.parse(localStorage.getItem('user'));
      const blog: BlogMin = {
        role: TeamRoles.Owner,
        title: data.title,
        url: data.url,
        id: data.id,
        media: {
          logo: null,
        },
      };
      user.sites.unshift(blog);
      /**
       * Update authenticated user data
       */
      AuthService.setAuthenticatedUser(user);
      /**
       * Add created blog to the blog list
       */
      const index: number = BlogService.add(blog);
      BlogService.setCurrent(blog.id);
      /**
       * If user skipped or selected template was 'zero' then ignore setting blog template
       */
      if (this.templateSelected && this.templateSelected.name !== 'zero' && !this.skip) {
        this.setTemplate();
      }
      /**
       * Redirect to blog settings
       */
      this.router.navigate(['dash', index, 'settings']);
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
