import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HighlightTheme } from '@app/enums/highlight-theme';
import { TemplatePrimaryColor } from '@app/enums/template-primary-color';
import { File } from '@app/interfaces/file';
import { Params } from '@app/interfaces/params';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Template } from '@app/interfaces/v1/template';
import { TemplateConfig } from '@app/interfaces/v1/template-config';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { CarouselComponent, BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-settings-appearance',
  templateUrl: './settings-appearance.component.html',
  styleUrls: ['./settings-appearance.component.scss'],
})
export class SettingsAppearanceComponent implements OnInit {

  readonly faTrash: IconDefinition = faTrash;
  readonly faEye: IconDefinition = faEye;

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
   * Current viewing theme index
   */
  @ViewChild('themeCarousel', { static: false })
  themeCarousel: CarouselComponent;

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

  /**
   * Current blog template config API loading indicator
   */
  templateConfigLoading: boolean;

  /**
   * What is file selection is being used for
   */
  selectingFor: keyof BlogSettings['media'];

  /**
   * File list modal
   */
  fileListModalRef: BsModalRef;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private blogService: BlogService,
              private modalService: BsModalService) {
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
     * Load template config
     */
    this.blogService.getTemplateConfig()
      .subscribe((data: { template_config: TemplateConfig }): void => {
        /**
         * Get templates
         */
        this.blogService.getBlogTemplates()
          .subscribe((response: { templates: Template[] }): void => {
            this.templates = response.templates;
            /**
             * Set current viewing theme
             */
            this.changeDetectorRef.detectChanges();
            this.themeCarousel.activeSlide = this.templates.findIndex(
              theme => this.templateConfig.name === theme.name,
            );
          });
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
   * @returns Current viewing theme
   */
  getThemeViewing(): Template {
    return this.templates[this.themeCarousel.activeSlide];
  }

  /**
   * Set blog template
   */
  setTemplate() {
    this.themeLoading = true;
    this.blogService.setTemplate(this.getThemeViewing().id).subscribe((): void => {
      this.themeLoading = false;
      this.templateConfig = this.getThemeViewing().config;
    });
  }

  /**
   * Update theme
   */
  submitSettings(payload: Params = this.themeForm.value): void {
    this.themeLoading = true;
    this.blogService.updateSettings(payload).subscribe((data: BlogSettings): void => {
      this.themeLoading = false;
      this.settings = data;
    });
  }

  /**
   * Get blog theme and its config
   */
  getTemplateConfig(): void {
    this.templateConfigLoading = true;
    this.blogService.getTemplateConfig().subscribe((data: { template_config: TemplateConfig }): void => {
      this.templateConfigLoading = false;
      this.templateConfig = data.template_config;
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
  showFileListModal(template: TemplateRef<any>, selectingFor: keyof BlogSettings['media']) {
    this.selectingFor = selectingFor;
    this.fileListModalRef = this.modalService.show(template, {
      class: 'modal-lg',
    });
  }

  /**
   * On file selection
   *
   * @param file Selected file
   */
  onFileSelect(file: File) {
    this.fileListModalRef.hide();
    const payload: Params = {};
    payload[this.selectingFor] = file.id;
    this.submitSettings(payload);
  }

  /**
   * @returns Current selected media ID
   */
  getSelectingForSelected(): string | void {
    if (this.selectingFor && this.settings && this.settings.media[this.selectingFor]) {
      return this.settings.media[this.selectingFor].id;
    }
  }
}
