import { WidgetID } from '@app/components/dash/builder/shared/enums/widget-id';
import { Widget } from './widget';

export class Card extends Widget {

  constructor(init: Partial<Widget>) {
    super({
      id: WidgetID.CARD,
      name: 'Card',
      tag: 'div',
      attributes: {
        class: ['border', 'p-3', 'rounded'],
      },
      canHaveChildren: true,
    });
    Object.assign(this, init);
  }
}
