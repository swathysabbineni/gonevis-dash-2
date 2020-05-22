import { WidgetID } from '@app/components/dash/builder/shared/enums/widget-id';
import { WidgetConfig } from '@app/components/dash/builder/shared/interfaces/widget-config';
import { Element } from './element';

export class Widget extends Element {

  constructor(init: Partial<Widget>) {
    super(init);
    this.resetValues();
  }

  /**
   * Unique widget ID
   */
  id: WidgetID;

  /**
   * Widget name
   */
  name: string;

  /**
   * Configurations for the widget
   */
  configs: WidgetConfig[];

  /**
   * Values for the widget configurations
   */
  values: Record<string, string>;

  /**
   * Does this widget support having children
   */
  canHaveChildren: boolean;

  /**
   * Reset all config values to default
   */
  resetValues(): void {
    if (this.configs) {
      for (const config of this.configs) {
        config[config.id] = config.default;
      }
    }
  }
}
