export interface TemplateConfig {
  template_config: {
    url: string;
    name: string;
    author: string;
    fields: {
      [fieldName: string]: {
        type: string;
        value: boolean;
        help_text: string;
        verbose_name: string;
      };
    };
  };
}
