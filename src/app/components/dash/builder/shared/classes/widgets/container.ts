import { Widget } from '@builder/shared/classes/widget';
import { WidgetID } from '@builder/shared/enums/widget-id';

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
