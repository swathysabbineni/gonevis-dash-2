import { WidgetID } from '@app/components/dash/builder/shared/enums/widget-id';
import { Widget } from './widget';

export class Container extends Widget {

  constructor(init: Partial<Widget>) {
    super({
      id: WidgetID.CONTAINER,
      name: 'Container',
      tag: 'div',
      attributes: {
        class: ['container', 'py-3'],
      },
      canHaveChildren: true,
    });
    Object.assign(this, init);
  }
}
