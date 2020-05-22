import { WidgetConfigType } from '@app/components/dash/builder/shared/enums/widget-config-type';

export interface WidgetConfig {
  id: string;
  label: string;
  type: WidgetConfigType;
  options?: string[];
  default?: any;
}
