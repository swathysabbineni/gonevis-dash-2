import { TemplateConfigFields } from '@app/interfaces/v1/template-config-fields';

export interface TemplateConfig {
  url: string;
  name: string;
  author: string;
  fields: TemplateConfigFields;
}
