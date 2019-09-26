import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { Template } from '@app/interfaces/v1/template';
import { AuthService } from '@app/services/auth/auth.service';
import { BlogService } from '@app/services/blog/blog.service';
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

  readonly arrowRight = faArrowRight;
  readonly envelope = faEnvelope;
  readonly lock = faLock;

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

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService,
              private authService: AuthService) {
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
}
