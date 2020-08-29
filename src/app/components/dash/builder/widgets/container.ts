import { Widget } from 'src/app/components/dash/builder/core/widget';
import { WidgetType } from 'src/app/components/dash/builder/core/widget-type';

export class Container extends Widget {
  constructor() {
    super({
      type: WidgetType.CONTAINER,
      tagName: 'div',
      displayName: 'Container',
      classList: ['bg-danger'],
      attributes: {},
      styles: {},
      canHaveChildren: true,
    });
  }
}
