import { Widget } from '@builder/shared/classes/widget';
import { widgets } from '@builder/shared/consts/widgets';
import { WidgetID } from '@builder/shared/enums/widget-id';

/**
 * Reference to a widget with values for its configuration.
 * It also holds children as same type.
 *
 * Once widget children or config values have changed,
 * call {@see resetWidget} to update the referenced class.
 *
 * For a widget reference to be created, you only need
 * the {@see id}, {@see values} and {@see children}.
 */
export class WidgetReference {

  constructor(init?: Partial<WidgetReference>) {
    Object.assign(this, init);
    this.resetWidget();
    if (this.widget.configs) {
      for (const config of this.widget.configs) {
        if (!this.values[config.id]) {
          this.values[config.id] = config.default;
        }
      }
    }
  }

  /**
   * Referenced widget ID
   */
  id: WidgetID;

  /**
   * Referenced widget class with configuration values applied to it
   */
  widget: Widget;

  /**
   * Widget reference config values to override
   */
  values: Record<string, any> = {};

  /**
   * List of widget reference children
   */
  children: WidgetReference[] = [];

  /**
   * Generate the {@see widget} with children as
   * widgets and values to override the configs.
   */
  resetWidget(): void {
    this.widget = new widgets[this.id]({
      values: this.values,
      children: this.children.map(((value: WidgetReference): Widget => value.widget)),
    });
  }

  /**
   * Add a child
   * @param child Child widget to add
   */
  addChild(child: WidgetReference): void {
    this.children.push(child);
    this.resetWidget();
  }

  /**
   * Remove a child
   * @param child Child widget to remove
   */
  removeChild(child: WidgetReference): void {
    this.children.splice(this.children.indexOf(child), 1);
    this.resetWidget();
  }
}
