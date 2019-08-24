import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { BlogService } from '@app/services/blog/blog.service';

@Component({
  selector: 'app-settings-general',
  templateUrl: './settings-general.component.html',
  styleUrls: ['./settings-general.component.scss'],
})
export class SettingsGeneralComponent implements OnInit {

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
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    /**
     * Get blog settings
     */
    this.blogService.getSettings(BlogService.currentBlog.id).subscribe((data: BlogSettings): void => {
      this.settings = data;
      /**
       * Set initial blog form data
       */
      this.blogForm.patchValue({
        title: data.title,
        description: data.description,
      });
      this.blogLoading = false;
    });
  }

  /**
   * Submit blog settings form
   */
  submitBlog(): void {
    this.blogLoading = true;
    this.blogService.updateSettings(
      BlogService.currentBlog.id, this.blogForm.value,
    ).subscribe((data: BlogSettings): void => {
      this.settings = data;
      this.blogLoading = false;
      this.blogErrors = {};
    }, (error): void => {
      this.blogLoading = false;
      this.blogErrors = error.error;
    });
  }
}
