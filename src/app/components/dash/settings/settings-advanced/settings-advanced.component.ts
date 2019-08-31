import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Params } from '@app/interfaces/params';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { BlogService } from '@app/services/blog/blog.service';

@Component({
  selector: 'app-settings-advanced',
  templateUrl: './settings-advanced.component.html',
  styleUrls: ['./settings-advanced.component.scss']
})
export class SettingsAdvancedComponent implements OnInit {

  /**
   * Advanced form
   */
  advanceForm: FormGroup;

  /**
   * Blog settings data
   */
  settings: BlogSettings;

  /**
   * Number of Posts Per Page
   */
  postPerPage = Array.from(Array(25).keys());

  /**
   * Advanced form API loading indicator
   */
  advancedLoading: boolean;

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService) { }

  ngOnInit(): void {
    /**
     * Setup advanced form
     */
    this.advanceForm = this.formBuilder.group({
      meta_description: [''],
      paginate_by: [''],
      commenting: [null],
      voting: [null],
      show_views_count: [null],
      search_engine_visibility: [null],
    });
    /**
     * Get blog settings
     */
    this.getSettings();
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
       * Set up the theme form with default values
       */
      this.advanceForm.patchValue({
        meta_description: this.settings.meta_description,
        paginate_by: this.settings.paginate_by,
        commenting: this.settings.commenting,
        voting: this.settings.voting,
        show_views_count: this.settings.show_views_count,
        search_engine_visibility: this.settings.search_engine_visibility,
      });
    });
  }

  /**
   * Update blog settings
   */
  submit(payload: Params = this.advanceForm.value): void {
    this.advancedLoading = true;
    this.blogService.updateSettings(payload).subscribe((): void => {
      this.advancedLoading = false;
      this.getSettings();
    });
  }
}
