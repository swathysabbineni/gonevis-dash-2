import { Widget } from '@builder/shared/classes/widget';
import { WidgetConfigType } from '@builder/shared/enums/widget-config-type';
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
      configs: [
        {
          id: 'i-do-nothing',
          label: 'I do nothing',
          type: WidgetConfigType.TEXT,
        },
        {
          id: 'i-do-nothing2',
          label: 'I do nothing 2',
          type: WidgetConfigType.TEXT,
        },
      ],
      canHaveChildren: true,
    });
    Object.assign(this, init);
  }
}
