import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HighlightTheme } from '@app/enums/highlight-theme';
import { TemplatePrimaryColor } from '@app/enums/template-primary-color';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Template } from '@app/interfaces/v1/template';
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
  form: FormGroup;

  /**
   * Theme form API loading indicator
   */
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    /**
     * Setup theme form
     */
    this.form = this.formBuilder.group({
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
  }

  /**
   * Get blog settings
   */
  getSettings(): void {
    this.loading = true;
    this.blogService.getSettings().subscribe((data: BlogSettings): void => {
      this.loading = false;
      this.settings = data;
      // /**
      //  * Set up the theme form with default values
      //  */
      // this.form.patchValue({
      //   highlight_theme: data.highlight_theme,
      //   template_primary_color: data.template_primary_color,
      // });
    });
  }

  /**
   * Update theme
   */
  updateTheme(): void {
    this.loading = true;
    this.blogService.updateTheme(this.form.value).subscribe((): void => {
      this.loading = false;
    });
  }

  /**
   * Remove blog logo
   */
  removeLogo(): void {
    this.blogService.removeBlogLogo(null).subscribe((): void => {
      this.settings.media.logo = null;
    });
  }

  /**
   * Remove blog cover
   */
  removeCover(): void {
    this.blogService.removeBlogCover(null).subscribe((): void => {
      this.settings.media.cover_image = null;
    });
  }
}
