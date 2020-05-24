import { WidgetConfigType } from '@builder/shared/enums/widget-config-type';
import { WidgetConfigOption } from '@builder/shared/interfaces/widget-config-option';

export interface WidgetConfig {
  id: string;
  label: string;
  type: WidgetConfigType;
  options?: WidgetConfigOption[];
  default?: any;
}
