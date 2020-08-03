import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HighlightTheme } from '@app/enums/highlight-theme';
import { MetricStatItem } from '@app/enums/metric-stat-item';
import { MetricStatResolution } from '@app/enums/metric-stat-resolution';
import { TemplatePrimaryColor } from '@app/enums/template-primary-color';
import { ApiResponse } from '@app/interfaces/api-response';
import { BlogCreate } from '@app/interfaces/blog-create';
import { Params } from '@app/interfaces/params';
import { UserAuth } from '@app/interfaces/user-auth';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { MetricStat } from '@app/interfaces/v1/metric-stat';
import { Metrics } from '@app/interfaces/v1/metrics';
import { Subscriber } from '@app/interfaces/zero/subscriber';
import { Tag } from '@app/interfaces/v1/tag';
import { Template } from '@app/interfaces/v1/template';
import { TemplateConfig } from '@app/interfaces/v1/template-config';
import { TemplateConfigFields } from '@app/interfaces/v1/template-config-fields';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { ApiService } from '@app/services/api/api.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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

  /**
   * Blogs subject which emits list of blogs data information value whenever it is subscribed to.
   * @see BehaviorSubject
   */
  private static blogsSubject: BehaviorSubject<BlogMin[]> = new BehaviorSubject<BlogMin[]>([]);

  /**
   * An observable snapshot data of {@link blogsSubject} value
   * @see Observable
   */
  static blogsObservable: Observable<BlogMin[]> = BlogService.blogsSubject.asObservable();

  constructor(private http: HttpClient,
              private api: ApiService,
              private translate: TranslateService,
              private toast: ToastrService) {
  }

  /**
   * @return Latest blog list data information from local storage
   */
  static get blogs(): BlogMin[] {
    return JSON.parse(localStorage.getItem('user')).sites.reverse();
  }

  static set blogs(value: BlogMin[]) {
    const data: UserAuth = JSON.parse(localStorage.getItem('user'));
    data.sites = value;
    localStorage.setItem('user', JSON.stringify(data));
    BlogService.blogsSubject.next(value.reverse());
  }

  /**
   * @return Latest current blog's data information from local storage
   */
  static get currentBlog(): BlogMin {
    return BlogService.blogsSubject.value[BlogService.currentBlogIndex];
  }

  /**
   * @return Current blog index
   */
  static get currentBlogIndex(): number {
    if (location.pathname.indexOf('/dash/') === 0) {
      return Number(location.pathname.split('/')[2]);
    }
  }

  /**
   * @return Blog index
   */
  static getBlogIndex(id: string): number {
    return BlogService.blogsSubject.value.findIndex((blog: BlogMin): boolean => blog.id === id);
  }

  /**
   * Create blog
   *
   * @param url Blog's URL
   * @param title Blog's title
   */
  create(url: string, title: string): Observable<BlogCreate> {
    return this.http.post<BlogCreate>(`${this.api.base.v1}create-site/`, { url, title });
  }

  /**
   * Get metrics
   */
  getMetrics(): Observable<Metrics> {
    return this.http.get<Metrics>(`${this.api.base.v1}site/${BlogService.currentBlog.id}/metrics/`);
  }

  /**
   * Get templates of current blog
   */
  getBlogTemplates(): Observable<{ templates: Template[] }> {
    return this.http.get<{ templates: Template[] }>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/templates/`,
    );
  }

  /**
   * Get templates
   */
  getTemplates(): Observable<ApiResponse<Template>> {
    return this.http.get<ApiResponse<Template>>(`${this.api.base.v1}templates/`);
  }

  /**
   * Set blog template
   *
   * @param template Template ID
   */
  setTemplate(template: string): Observable<void> {
    return this.http.put<void>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/set-template/`, {
        site_template_id: template,
      },
    ).pipe(map((() => {
      this.toast.success(this.translate.instant('TOAST_UPDATE'), this.translate.instant('THEME'));
    })));
  }

  /**
   * Get current template data
   */
  getTemplateConfig(): Observable<{ template_config: TemplateConfig }> {
    return this.http.get<{ template_config: TemplateConfig }>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/template-config/`,
    );
  }

  /**
   * Update current template config
   *
   * @param fields Template config data
   */
  setTemplateConfig(fields: TemplateConfigFields): Observable<{ template_config: TemplateConfig }> {
    return this.http.put<{ template_config: TemplateConfig }>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/set-template-config/`, {
        config_fields: fields,
      },
    ).pipe(map((data => {
      this.toast.info(this.translate.instant('TOAST_UPDATE'), this.translate.instant('THEME_OPTIONS'));
      return data;
    })));
  }

  /**
   * Get blog settings
   */
  getSettings(): Observable<BlogSettings> {
    return this.http.get<BlogSettings>(`${this.api.base.v1}site/${BlogService.currentBlog.id}/settings/`);
  }

  /**
   * Update blog settings
   *
   * @param payload Blog update data
   */
  updateSettings(payload: Partial<BlogSettings>): Observable<BlogSettings> {
    return this.http.put<BlogSettings>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/update-settings/`, payload,
    ).pipe(map((data => {
      const blogs: BlogMin[] = BlogService.blogsSubject.value;
      const blog: BlogMin = blogs.find(item => item.id === BlogService.currentBlog.id);
      blog.title = data.title;
      if (data.media.logo) {
        blog.media.logo = {
          thumbnail_48x48: data.media.logo.thumbnail_48x48,
        };
      } else {
        blog.media.logo = null;
      }
      BlogService.blogs = blogs.reverse();
      this.toast.info(this.translate.instant('TOAST_UPDATE'), this.translate.instant('SETTINGS'));
      return data;
    })));
  }

  /**
   * Update remove branding
   *
   * @param status Blog update data
   */
  updateRemoveBranding(status: boolean): Observable<BlogSettings> {
    return this.http.put<BlogSettings>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/remove-branding/`, {
        remove_branding: status,
      },
    );
  }

  /**
   * Update font
   *
   * @param payload Update font
   */
  updateFont(payload: Params): Observable<BlogSettings> {
    return this.http.put<BlogSettings>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/set-font/`, payload,
    );
  }

  /**
   * Update footer text
   *
   * @param status Blog update data
   */
  updateFooterText(status: string): Observable<BlogSettings> {
    return this.http.put<BlogSettings>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/set-custom-footer/`, {
        footer_text: status,
      },
    );
  }

  /**
   * Update google analytics
   *
   * @param payload Blog update data
   */
  updateGoogleAnalytics(payload: Params): Observable<BlogSettings> {
    return this.http.put<BlogSettings>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/google-analytics/`, payload);
  }

  /**
   * Update google adSense
   *
   * @param payload Blog update data
   */
  updateGoogleAdsense(payload: Params): Observable<BlogSettings> {
    return this.http.put<BlogSettings>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/google-adsense/`, payload);
  }

  /**
   * Add blog domain
   * Note that this endpoint returns a structure that is useless so we set it as `void`.
   *
   * @param domain Domain address
   */
  addDomain(domain: string): Observable<void> {
    return this.http.put<void>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/set-custom-domain/`, { domain },
    ).pipe(map((data => {
      this.toast.info(this.translate.instant('TOAST_ADD'), domain);
      return data;
    })));
  }

  /**
   * Remove blog domain
   *
   * @param domain Domain ID
   */
  removeDomain(domain: number): Observable<void> {
    return this.http.put<void>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/remove-custom-domain/`, { domain_id: domain },
    ).pipe(map((() => {
      this.toast.info(this.translate.instant('TOAST_DELETE'), this.translate.instant('DOMAIN'));
    })));
  }

  /**
   * Set a domain as primary
   *
   * @param domain Domain ID
   */
  setDomainPrimary(domain: number): Observable<void> {
    return this.http.put<void>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/set-primary-domain/`, { domain_id: domain },
    ).pipe(map((() => {
      this.toast.info(this.translate.instant('TOAST_UPDATE'), this.translate.instant('PRIMARY_DOMAIN'));
    })));
  }

  /**
   * Check sub-domain availability
   *
   * @param domain Domain slug
   */
  domainCheck(domain: string): Observable<void> {
    return this.http.post<void>(`${this.api.base.v1}domain-check/`, { domain });
  }

  /**
   * Get blog subscribers
   */
  getSubscribers(): Observable<ApiResponse<Subscriber>> {
    return this.http.get<ApiResponse<Subscriber>>(
      `${this.api.base.zero}website/site/${BlogService.currentBlog.id}/subscribers/`,
    );
  }

  /**
   * Update tag
   *
   * @param payload tag payload
   * @param slug tag slug
   */
  updateTag(slug: string, payload: Params): Observable<Tag> {
    return this.http.put<Tag>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/tagool/tag/${slug}/`,
      payload,
    ).pipe(map((data => {
        this.toast.info(this.translate.instant('TOAST_UPDATE'), slug);
        return data;
      })),
    );
  }

  /**
   * Get blog metric stats for views, comments and votes by any resolution
   *
   * @param item Item to get stats for (views, comments or likes)
   * @param filters API filters (by resolution, limit, etc)
   */
  getMetricStat(item: MetricStatItem, filters: {
    resolution: MetricStatResolution,
    limit?: number,
    entry?: string,
    date_min?: Date,
    date_max?: Date,
  }): Observable<ApiResponse<MetricStat>> {
    const params = new HttpParams({
      fromObject: {
        resolution: filters.resolution,
      },
    });
    if (filters.entry) {
      params.append('entry', filters.entry);
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters.date_min) {
      params.append('date_min', filters.date_min.toString());
    }
    if (filters.date_max) {
      params.append('date_max', filters.date_max.toString());
    }
    return this.http.get<ApiResponse<MetricStat>>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/metric/${item}-stats/`, { params },
    );
  }
}
