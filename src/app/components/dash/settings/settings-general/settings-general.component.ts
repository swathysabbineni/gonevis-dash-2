import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Domain } from '@app/interfaces/v1/domain';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

@Component({
  selector: 'app-settings-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.scss'],
})
export class SettingsGeneralComponent implements OnInit, OnDestroy {

  readonly trash: IconDefinition = faTrash;

  /**
   * Blog settings data
   */
  settings: BlogSettings;

  /**
   * Blog form
   */
  blogForm: FormGroup = this.formBuilder.group({
    title: [null],
    description: [null],
  });

  /**
   * Blog form API loading indicator
   */
  blogLoading = true;

  /**
   * Blog form API errors
   */
  blogErrors: ApiError = {};

  /**
   * Domains form
   */
  domainsForm: FormGroup = this.formBuilder.group({
    domain: [null],
  });

  /**
   * Domains form API loading indicator
   */
  domainsLoading: boolean;

  /**
   * Domains form API errors
   */
  domainsErrors: ApiError = {};

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    BlogService.blog.pipe(untilComponentDestroyed(this)).subscribe((blog: BlogMin): void => {
      if (blog) {
        this.getSettings();
      }
    });
  }

  /**
   * Get blog settings
   */
  getSettings(): void {
    this.blogLoading = true;
    this.blogService.getSettings().subscribe((data: BlogSettings): void => {
      this.blogLoading = false;
      this.settings = data;
      /**
       * Set initial blog form data
       */
      this.blogForm.patchValue({
        title: data.title,
        description: data.description,
      });
    });
  }

  /**
   * Submit blog settings form
   */
  submitBlog(): void {
    this.blogLoading = true;
    this.blogService.updateSettings(this.blogForm.value).subscribe((data: BlogSettings): void => {
      this.settings = data;
      this.blogLoading = false;
      this.blogErrors = {};
    }, (error): void => {
      this.blogLoading = false;
      this.blogErrors = error.error;
    });
  }

  /**
   * Submit blog domain form
   */
  submitDomain(): void {
    this.domainsLoading = true;
    this.blogService.addDomain(this.domainsForm.value.domain).subscribe((): void => {
      this.getSettings();
      this.domainsLoading = false;
      this.domainsErrors = {};
      this.domainsForm.reset();
    }, (error): void => {
      this.domainsLoading = false;
      this.domainsErrors = error.error;
    });
  }

  /**
   * Remove blog domain
   *
   * @param domain Blog domain
   */
  removeDomain(domain: Domain): void {
    if (!confirm(this.translate.instant('CONFIRM_DELETE_DOMAIN'))) {
      return;
    }
    this.domainsLoading = true;
    this.blogService.removeDomain(domain.id).subscribe((): void => {
      this.settings.domains.splice(this.settings.domains.indexOf(domain), 1);
      this.domainsLoading = false;
    });
  }

  /**
   * @returns Link of the domain
   */
  getDomainLink(domain: Domain): string {
    return `//${domain.domain}`;
  }

  ngOnDestroy(): void {
  }
}
