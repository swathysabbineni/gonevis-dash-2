export interface TemplateConfig {
  url: string;
  name: string;
  author: string;
  fields: {
    [fieldName: string]: {
      type: 'string' | 'boolean';
      value: boolean;
      help_text: string;
      verbose_name: string;
    };
  };
}
