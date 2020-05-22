import { WidgetID } from '@app/components/dash/builder/shared/enums/widget-id';

export interface WidgetReference {
  widget: WidgetID;
  config?: { [name: string]: any };
  children?: WidgetReference[];
}
