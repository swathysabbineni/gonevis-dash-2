import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HighlightTheme } from '@app/enums/highlight-theme';
import { TemplatePrimaryColor } from '@app/enums/template-primary-color';
import { Params } from '@app/interfaces/params';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Metrics } from '@app/interfaces/v1/metrics';
import { Template } from '@app/interfaces/v1/template';
import { TemplateConfig } from '@app/interfaces/v1/template-config';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { ApiService } from '@app/services/api/api.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  /**
   * List of template primary colors for blogs
   */
  static readonly templatePrimaryColor: { id: TemplatePrimaryColor, label: string, color: string }[] = [
    { id: TemplatePrimaryColor.DEFAULT, label: 'Default', color: '#007bff' },
    { id: TemplatePrimaryColor.ALIZARIN, label: 'Alizarin', color: '#e74c3c' },
    { id: TemplatePrimaryColor.AMETHYST, label: 'Amethyst', color: '#9b59b6' },
    { id: TemplatePrimaryColor.BELIZE_HOLE, label: 'Belize Hole', color: '#2980b9' },
    { id: TemplatePrimaryColor.CARROT, label: 'Carrot', color: '#e67e22' },
    { id: TemplatePrimaryColor.EMERALD, label: 'Emerald', color: '#2ecc71' },
    { id: TemplatePrimaryColor.GREEN_SEA, label: 'Green Sea', color: '#16a085' },
    { id: TemplatePrimaryColor.MIDNIGHT_BLUE, label: 'Midnight Blue', color: '#2c3e50' },
    { id: TemplatePrimaryColor.NEPHRITIS, label: 'Nephritis', color: '#27ae60' },
    { id: TemplatePrimaryColor.PETER_RIVER, label: 'Peter River', color: '#3498db' },
    { id: TemplatePrimaryColor.POMEGRANATE, label: 'Pomegranate', color: '#c0392b' },
    { id: TemplatePrimaryColor.PUMPKIN, label: 'Pumpkin', color: '#d35400' },
    { id: TemplatePrimaryColor.SUN_FLOWER, label: 'Sun Flower', color: '#f1c40f' },
    { id: TemplatePrimaryColor.TURQUOISE, label: 'Turquoise', color: '#1abc9c' },
    { id: TemplatePrimaryColor.WET_ASPHALT, label: 'Wet Asphalt', color: '#34495e' },
    { id: TemplatePrimaryColor.WISTERIA, label: 'Wisteria', color: '#8e44ad' },
  ];

  /**
   * List of themes for code block highlighting for blogs
   */
  static readonly highlightThemes: { id: HighlightTheme, label: string }[] = [
    { id: HighlightTheme.DEFAULT, label: 'Default' },
    { id: HighlightTheme.ATOM_ONE_DARK, label: 'Atom One' },
    { id: HighlightTheme.ATOM_ONE_LIGHT, label: 'Atom One Light' },
    { id: HighlightTheme.ANDROIDSTUDIO, label: 'Androidstudio' },
    { id: HighlightTheme.AGATE, label: 'Agate' },
    { id: HighlightTheme.COLOR_BREWER, label: 'Color Brewer' },
    { id: HighlightTheme.DRACULA, label: 'Dracula' },
    { id: HighlightTheme.GITHUB, label: 'Github' },
    { id: HighlightTheme.MONOKAI_SUBLIME, label: 'Monokai Sublime' },
    { id: HighlightTheme.MONO_BLUE, label: 'Mono Blue' },
    { id: HighlightTheme.RAINBOW, label: 'Rainbow' },
    { id: HighlightTheme.RAILSCASTS, label: 'Railscasts' },
    { id: HighlightTheme.SOLARIZED_DARK, label: 'Solarized Dark' },
    { id: HighlightTheme.SOLARIZED_LIGHT, label: 'Solarized Light' },
    { id: HighlightTheme.TOMORROW, label: 'Tomorrow' },
    { id: HighlightTheme.VS, label: 'VS' },
    { id: HighlightTheme.ZENBURN, label: 'Zenburn' },
  ];

  private static blogSubject: BehaviorSubject<BlogMin> = new BehaviorSubject<BlogMin>(null);

  static blog: Observable<BlogMin> = BlogService.blogSubject.asObservable();

  constructor(private http: HttpClient,
              private apiService: ApiService,
              private api: ApiService) {
  }

  /**
   * Update current blog
   *
   * @param blog Blog data
   */
  static set currentBlog(blog: BlogMin) {
    localStorage.setItem('blog', JSON.stringify(blog));
    BlogService.blogSubject.next(blog);
  }

  /**
   * @return Current blog
   */
  static get currentBlog(): BlogMin {
    return JSON.parse(localStorage.getItem('blog'));
  }

  /**
   * Get metrics
   */
  getMetrics(): Observable<Metrics> {
    return this.http.get<Metrics>(`${this.apiService.base.v1}website/site/${BlogService.currentBlog.id}/metrics`);
  }

  /**
   * Get templates
   */
  getTemplates(): Observable<{ templates: Template[] }> {
    return this.http.get<{ templates: Template[] }>(
      `${this.apiService.base.v1}website/site/${BlogService.currentBlog.id}/templates`,
    );
  }

  /**
   * Get current template data
   */
  getTemplateConfig(): Observable<{ template_config: TemplateConfig }> {
    return this.http.get<{ template_config: TemplateConfig }>(
      `${this.apiService.base.v1}website/site/${BlogService.currentBlog.id}/template-config`,
    );
  }

  /**
   * Get blog settings
   */
  getSettings(): Observable<BlogSettings> {
    return this.http.get<BlogSettings>(`${this.api.base.v1}website/site/${BlogService.currentBlog.id}/settings/`);
  }

  /**
   * Update blog settings
   *
   * @param payload Blog update data
   */
  updateSettings(payload: Params): Observable<BlogSettings> {
    return this.http.put<BlogSettings>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/update-settings/`, payload,
    );
  }

  /**
   * Add blog domain
   * Note that this endpoint returns a structure that is useless so we set it as `void`.
   *
   * @param domain Domain address
   */
  addDomain(domain: string): Observable<void> {
    return this.http.put<void>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/set-custom-domain/`, { domain },
    );
  }

  /**
   * Remove blog domain
   *
   * @param domain Domain ID
   */
  removeDomain(domain: number): Observable<void> {
    return this.http.put<void>(
      `${this.api.base.v1}website/site/${BlogService.currentBlog.id}/remove-custom-domain/`, {
        domain_id: domain,
      },
    );
  }
}
