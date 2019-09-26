import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { Template } from '@app/interfaces/v1/template';
import { BlogService } from '@app/services/blog/blog.service';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {

  readonly faArrowRight = faArrowRight;

  /**
   * Current step of getting started
   */
  step: 'address' | 'theme' | 'register' = 'address';

  /**
   * Getting started form
   */
  form: FormGroup;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * API errors
   */
  errors: ApiError = {};

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
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    /**
     * Setup getting started form
     */
    this.form = this.formBuilder.group({
      domain: [null, Validators.required],
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
    this.blogService.domainCheck(this.form.get('domain').value).subscribe((): void => {
      this.loading = false;
      this.errors = {};
    }, error => {
      this.loading = false;
      this.errors = error.error;
    });
  }
}
