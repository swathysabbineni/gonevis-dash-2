import { WidgetID } from '@app/components/dash/builder/shared/enums/widget-id';
import { Widget } from './widget';

export class Space extends Widget {

  constructor(init: Partial<Widget>) {
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
