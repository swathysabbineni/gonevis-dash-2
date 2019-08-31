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
  form: FormGroup;

  /**
   * Blog settings data
   */
  settings: BlogSettings;

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
    this.form = this.formBuilder.group({
      meta_description: [''],
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
      this.form.patchValue({
        meta_description: this.settings.meta_description,
      });
    });
  }

  /**
   * Update blog settings
   */
  submit(payload: Params = this.form.value): void {
    this.advancedLoading = true;
    this.blogService.updateSettings(payload).subscribe((): void => {
      this.advancedLoading = false;
      this.getSettings();
    });
  }

}
