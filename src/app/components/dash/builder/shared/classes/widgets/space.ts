import { Widget } from '@builder/shared/classes/widget';
import { WidgetID } from '@builder/shared/enums/widget-id';

export class Space extends Widget {

  constructor(init: Widget) {
    super({
      id: WidgetID.SPACE,
      name: 'Space',
      tag: 'div',
      attributes: {
        class: ['my-3'],
      },
    });
    Object.assign(this, init);
  }
}
