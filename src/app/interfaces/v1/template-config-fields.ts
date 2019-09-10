export interface TemplateConfigFields {
  [fieldName: string]: {
    type: 'string' | 'boolean';
    value: boolean;
    help_text: string;
    verbose_name: string;
  };
}
