import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HighlightTheme } from '@app/enums/highlight-theme';
import { TemplatePrimaryColor } from '@app/enums/template-primary-color';
import { ApiError } from '@app/interfaces/api-error';
import { File } from '@app/interfaces/file';
import { Params } from '@app/interfaces/params';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Template } from '@app/interfaces/v1/template';
import { TemplateConfig } from '@app/interfaces/v1/template-config';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { BlogService } from '@app/services/blog/blog.service';
import { FileSelectionComponent } from '@app/shared/file-selection/file-selection.component';
import { Plan } from '@app/shared/locked-feature/shared/enums/plan';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-settings-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss'],
})
export class AppearanceComponent implements OnInit {

  readonly faTrash: IconDefinition = faTrash;
  readonly faEye: IconDefinition = faEye;

  readonly plan = Plan;

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
   * Templates API loading indicator
   */
  templatesLoading: boolean;

  /**
   * Available templates for blogs
   */
  templates: Template[];

  /**
   * Customization theme
   */
  customizationForm: FormGroup;

  /**
   * Customization theme API loading indicator
   */
  customizationLoading = true;

  /**
   * Font theme
   */
  fontForm: FormGroup;

  /**
   * Customization theme API loading indicator
   */
  fontLoading = true;

  /**
   * Current blog theme and its config
   */
  templateConfig: TemplateConfig;

  /**
   * Current blog template config API loading indicator
   */
  templateConfigLoading = true;

  /**
   * What is file selection is being used for
   */
  selectingFor: keyof BlogSettings['media'];

  /**
   * Blog form API errors
   */
  fontErrors: ApiError = {};

  constructor(private formBuilder: FormBuilder,
              private blogService: BlogService,
              private modalService: BsModalService) {
  }

  ngOnInit(): void {
    /**
     * Setup theme form
     */
    this.customizationForm = this.formBuilder.group({
      highlight_theme: [HighlightTheme.DEFAULT],
      template_primary_color: [TemplatePrimaryColor.DEFAULT],
    });
    /**
     * Setup font form
     */
    this.fontForm = this.formBuilder.group({
      font_name: null,
      font_url: null,
    });
    /**
     * Get settings
     */
    this.blogService.getSettings().subscribe((data: BlogSettings): void => {
      this.customizationLoading = false;
      this.fontLoading = false;
      this.settings = data;
      /**
       * Set up the theme form with default values
       */
      this.customizationForm.patchValue({
        highlight_theme: data.highlight_theme,
        template_primary_color: data.template_primary_color,
      });
      /**
       * Set up the font form with default values
       */
      this.fontForm.patchValue({
        font_name: data.font_name,
        font_url: data.font_url,
      });
    });
    /**
     * Get templates
     */
    this.blogService.getBlogTemplates().subscribe((response: { templates: Template[] }): void => {
      this.templates = response.templates;
    });
    /**
     * Get blog theme and its config
     */
    this.blogService.getTemplateConfig().subscribe((data: { template_config: TemplateConfig }): void => {
      this.templateConfigLoading = false;
      this.templateConfig = data.template_config;
    });
  }

  /**
   * @returns Current template primary color (used for view)
   */
  getCurrentPrimaryColor(): string {
    return this.templatePrimaryColors[this.customizationForm.controls.template_primary_color.value].color;
  }

  /**
   * Set blog template
   */
  setTemplate(template: Template): void {
    this.templatesLoading = true;
    this.blogService.setTemplate(template.id).subscribe((): void => {
      this.templateConfig = template.config;
      this.templatesLoading = false;
    });
  }

  /**
   * Update theme
   */
  submitSettings(payload: Params = this.customizationForm.value): void {
    this.customizationLoading = true;
    this.blogService.updateSettings(payload).subscribe((data: BlogSettings): void => {
      this.customizationLoading = false;
      this.settings = data;
    });
  }

  setFont(): void {
    this.fontLoading = true;
    this.blogService.updateFont(this.fontForm.value).subscribe((data: BlogSettings): void => {
      this.fontLoading = false;
      /**
       * Set up the font form with default values
       */
      this.fontForm.patchValue({
        font_name: data.font_name,
        font_url: data.font_url,
      });
      this.fontErrors = {};
    }, (error: HttpErrorResponseApi): void => {
      this.fontLoading = false;
      this.fontErrors = error.error;
    });
  }

  /**
   * Update blog theme configs
   */
  updateTemplateConfig(): void {
    this.templateConfigLoading = true;
    this.blogService.setTemplateConfig(
      this.templateConfig.fields,
    ).subscribe((data: { template_config: TemplateConfig }) => {
      this.templateConfigLoading = false;
      this.templateConfig = data.template_config;
    });
  }

  /**
   * Show file selection modal
   */
  showFileListModal(selectingFor: keyof BlogSettings['media']) {
    this.selectingFor = selectingFor;
    let selected: string;
    if (selectingFor && this.settings && this.settings.media[selectingFor]) {
      selected = this.settings.media[selectingFor].id;
    }
    const modal = this.modalService.show(FileSelectionComponent, {
      class: 'modal-lg',
      initialState: {
        selected,
        selection: true,
      },
    });
    /**
     * On file select/choose
     */
    modal.content.choose.subscribe((file: File): void => {
      const payload: Params = {};
      payload[this.selectingFor] = file.id;
      this.submitSettings(payload);
    });
  }
}
