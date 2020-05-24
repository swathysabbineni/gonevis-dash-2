import { Widget } from '@builder/shared/classes/widget';
import { WidgetID } from '@builder/shared/enums/widget-id';
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare';

export class Card extends Widget {

  constructor(init: Partial<Widget>) {
    super({
      id: WidgetID.CARD,
      name: 'Card',
      icon: faSquare,
      tag: 'div',
      attributes: {
        class: ['border', 'p-3', 'rounded'],
      },
      canHaveChildren: true,
    });
    Object.assign(this, init);
  }
}
