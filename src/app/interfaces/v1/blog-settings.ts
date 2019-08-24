import { HighlightTheme } from '@app/enums/highlight-theme';
import { TemplatePrimaryColor } from '@app/enums/template-primary-color';
import { File } from '@app/interfaces/file';
import { Domain } from '@app/interfaces/v1/domain';

export interface BlogSettings {
  title: string;
  description: string;
  meta_description?: string;
  highlight_theme: HighlightTheme;
  template_primary_color: TemplatePrimaryColor;
  paginate_by: number;
  commenting: boolean;
  voting: boolean;
  media: {
    cover_image: File;
    logo: File;
  };
  url: string;
  domains: Domain[];
  search_engine_visibility: boolean;
  absolute_uri: string;
  remove_branding: boolean;
  footer_text?: string;
  google_analytics_code?: string;
  google_analytics_enabled: boolean;
  google_adsense_code?: string;
  google_adsense_enabled: boolean;
  show_views_count: boolean;
}
