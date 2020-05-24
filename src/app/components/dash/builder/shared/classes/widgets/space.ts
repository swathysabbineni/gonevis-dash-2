import { Widget } from '@builder/shared/classes/widget';
import { WidgetID } from '@builder/shared/enums/widget-id';
import { faArrowsAltV } from '@fortawesome/free-solid-svg-icons/faArrowsAltV';

export class Space extends Widget {

  constructor(init: Widget) {
    super({
      id: WidgetID.SPACE,
      name: 'Space',
      icon: faArrowsAltV,
      tag: 'div',
      attributes: {
        class: ['my-3'],
      },
    });
    Object.assign(this, init);
  }
}
