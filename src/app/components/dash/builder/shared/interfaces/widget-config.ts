import { WidgetConfigType } from '@builder/shared/enums/widget-config-type';

export interface WidgetConfig {
  id: string;
  label: string;
  type: WidgetConfigType;
  options?: string[];
  default?: any;
}
