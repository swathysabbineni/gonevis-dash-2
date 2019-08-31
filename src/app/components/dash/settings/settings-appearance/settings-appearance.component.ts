import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HighlightTheme } from '@app/enums/highlight-theme';
import { TemplatePrimaryColor } from '@app/enums/template-primary-color';
import { Params } from '@app/interfaces/params';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Template } from '@app/interfaces/v1/template';
import { TemplateConfig } from '@app/interfaces/v1/template-config';
import { BlogService } from '@app/services/blog/blog.service';

@Component({
  selector: 'app-settings-appearance',
  templateUrl: './settings-appearance.component.html',
  styleUrls: ['./settings-appearance.component.scss'],
})
export class SettingsAppearanceComponent implements OnInit {

  /**
   * @see BlogService.highlightThemes
   */
  readonly templatePrimaryColors: {
    id: TemplatePrimaryColor;
    label: string;
    color: string
  }[] = BlogService.templatePrimaryColor;

  /**
   * @see BlogService.highlightThemes
   */
  readonly highlightThemes: {
    id: HighlightTheme;
    label: string
  }[] = BlogService.highlightThemes;

  /**
   * Blog settings data
   */
  settings: BlogSettings;

  /**
   * Available templates for blogs
   */
  templates: Template[];

  /**
   * Theme form
   */
  themeForm: FormGroup;

  /**
   * Theme form API loading indicator
   */
  themeLoading: boolean;

  /**
   * Current blog theme and its config
   */
  templateConfig: TemplateConfig;

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    /**
     * Setup theme form
     */
    this.themeForm = this.formBuilder.group({
      highlight_theme: [HighlightTheme.DEFAULT],
      template_primary_color: [TemplatePrimaryColor.DEFAULT],
    });
    /**
     * Get settings
     */
    this.getSettings();
    /**
     * Get templates
     */
    this.blogService.getTemplates().subscribe((data: { templates: Template[] }): void => {
      this.templates = data.templates;
    });
    /**
     * Get current theme and config
     */
    this.getTemplateConfig();
  }

  /**
   * Get blog settings
   */
  getSettings(): void {
    this.themeLoading = true;
    this.blogService.getSettings().subscribe((data: BlogSettings): void => {
      this.themeLoading = false;
      this.settings = data;
      /**
       * Set up the theme form with default values
       */
      this.themeForm.patchValue({
        highlight_theme: data.highlight_theme,
        template_primary_color: data.template_primary_color,
      });
    });
  }

  /**
   * @returns Current template primary color (used for view)
   */
  getCurrentPrimaryColor(): string {
    return this.templatePrimaryColors[this.themeForm.controls.template_primary_color.value].color;
  }

  /**
   * Update theme
   */
  submitSettings(payload: Params = this.themeForm.value): void {
    this.themeLoading = true;
    this.blogService.updateSettings(payload).subscribe((): void => {
      this.themeLoading = false;
      this.getSettings();
    });
  }

  /**
   * Get blog theme and its config
   */
  getTemplateConfig(): void {
    this.blogService.getTemplateConfig().subscribe((data: { template_config: TemplateConfig }): void => {
      this.templateConfig = data.template_config;
    });
  }
}
