import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Params } from '@app/interfaces/params';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';

@Component({
  selector: 'app-settings-advanced',
  templateUrl: './settings-advanced.component.html',
  styleUrls: ['./settings-advanced.component.scss'],
})
export class SettingsAdvancedComponent implements OnInit {

  /**
   * Number of Posts Per Page
   */
  readonly postPerPage: void[] = new Array<void>(24);

  /**
   * Blog settings data
   */
  settings: BlogSettings;

  /**
   * Advanced form
   */
  advancedForm: FormGroup;

  /**
   * remove branding form
   */
  removeBrandingForm: FormGroup;

  /**
   * Google analytics form
   */
  googleAnalyticsForm: FormGroup;

  /**
   * Google adSense form
   */
  googleAdSenseForm: FormGroup;

  /**
   * Advanced form API loading indicator
   */
  advancedLoading: boolean;

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    /**
     * Setup advanced form
     */
    this.advancedForm = this.formBuilder.group({
      meta_description: [null],
      paginate_by: [null],
      commenting: [null],
      voting: [null],
      show_views_count: [null],
      search_engine_visibility: [null],
    });
    /**
     * Setup remove branding form
     */
    this.removeBrandingForm = this.formBuilder.group({
      remove_branding: [null],
      set_footer_text: [null],
    });
    /**
     * Setup google Analytics
     */
    this.googleAnalyticsForm = this.formBuilder.group({
      google_analytics_enabled: [null],
      google_analytics_code: [null],
    });
    /**
     * Setup google adSense form
     */
    this.googleAdSenseForm = this.formBuilder.group({
      google_adsense_enabled: [null],
      google_adsense_code: [null],
    });
    /**
     * Setup advanced form
     */
    this.advancedForm = this.formBuilder.group({
      meta_description: [null],
      paginate_by: [null],
      commenting: [null],
      voting: [null],
      show_views_count: [null],
      search_engine_visibility: [null],
    });
    BlogService.blog.subscribe((blog: BlogMin): void => {
      if (blog) {
        /**
         * Get blog settings
         */
        this.getSettings();
      }
    });
  }

  /**
   * Get blog settings
   */
  getSettings(): void {
    this.advancedLoading = true;
    this.blogService.getSettings().subscribe((data: BlogSettings): void => {
      this.advancedLoading = false;
      this.settings = data;
      /**
       * Set up the advanced form with default values
       */
      this.advancedForm.patchValue({
        meta_description: this.settings.meta_description,
        paginate_by: this.settings.paginate_by,
        commenting: this.settings.commenting,
        voting: this.settings.voting,
        show_views_count: this.settings.show_views_count,
        search_engine_visibility: this.settings.search_engine_visibility,
      });
      /**
       * Set up the remove branding form with default values
       */
      this.removeBrandingForm.patchValue({
        remove_branding: this.settings.remove_branding,
        set_footer_text: this.settings.footer_text,
      });
      /**
       * Set up the google analytics form with default values
       */
      this.googleAnalyticsForm.patchValue({
        google_analytics_enabled: this.settings.google_analytics_enabled,
        google_analytics_code: this.settings.google_analytics_code,
      });
      /**
       * Set up the google adSense form with default values
       */
      this.googleAdSenseForm.patchValue({
        google_adsense_enabled: this.settings.google_adsense_enabled,
        google_adsense_code: this.settings.google_adsense_code,
      });
    });
  }

  /**
   * Update blog settings
   */
  submit(payload: Params = this.advancedForm.value): void {
    this.advancedLoading = true;
    this.blogService.updateSettings(payload).subscribe((data: BlogSettings): void => {
      this.advancedLoading = false;
      this.settings = data;
    });
  }

  /**
   * Update remove branding
   */
  updateRemoveBranding(): void {
    this.advancedLoading = true;
    this.blogService.updateRemoveBranding(this.removeBrandingForm.value.remove_branding)
      .subscribe((data: BlogSettings): void => {
      this.advancedLoading = false;
      this.settings = data;
    });
    this.blogService.updateFooterText(this.removeBrandingForm.value.set_footer_text)
      .subscribe((data: BlogSettings): void => {
      this.advancedLoading = false;
      this.settings = data;
    });
  }

  /**
   * Update google analytics
   */
  updateGoogleAnalytics(): void {
    this.advancedLoading = true;
    this.blogService.updateGoogleAnalytics(this.googleAnalyticsForm.value).subscribe((data: BlogSettings): void => {
      this.advancedLoading = false;
      this.settings = data;
    });
  }

  /**
   * Update google adSense
   */
  updateGoogleAdSense(): void {
    this.advancedLoading = true;
    this.blogService.updateGoogleAdsense(this.googleAdSenseForm.value).subscribe((data: BlogSettings): void => {
      this.advancedLoading = false;
      this.settings = data;
    });
  }
}
