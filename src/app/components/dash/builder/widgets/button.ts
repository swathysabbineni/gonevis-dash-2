import { Widget } from 'src/app/components/dash/builder/core/widget';
import { WidgetType } from 'src/app/components/dash/builder/core/widget-type';

export class Button extends Widget {
  constructor() {
    super({
      type: WidgetType.BUTTON,
      tagName: 'button',
      displayName: 'Button',
      classList: ['btn btn-default'],
      attributes: {
        type: 'button',
      },
      styles: {},
      canHaveChildren: true,
    });
  }
}
