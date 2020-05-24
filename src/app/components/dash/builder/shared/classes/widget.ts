import { Element } from '@builder/shared/classes/element';
import { WidgetID } from '@builder/shared/enums/widget-id';
import { WidgetConfig } from '@builder/shared/interfaces/widget-config';

/**
 * Widgets are used to build HTML components and have user
 * select them and configure them to build the page with.
 *
 * Each widget should have a unique ID and name when extending
 * this main widget class.
 *
 * See the `./widgets/` for all the widgets that user can
 * select and build the page with.
 */
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
  values: Record<string, string> = {};

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
        this.values[config.id] = config.default;
      }
    }
  }
}
