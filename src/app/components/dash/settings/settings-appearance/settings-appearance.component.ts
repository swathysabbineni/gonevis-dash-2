import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
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
    this.blogService.getSettings().subscribe((data: BlogSettings): void => {
      this.settings = data;
    });
  }
}
