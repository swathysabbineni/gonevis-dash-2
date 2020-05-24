import { Widget } from '@builder/shared/classes/widget';
import { WidgetID } from '@builder/shared/enums/widget-id';
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand';

export class Container extends Widget {

  constructor(init: Partial<Widget>) {
    super({
      id: WidgetID.CONTAINER,
      name: 'Container',
      icon: faExpand,
      tag: 'div',
      attributes: {
        class: ['container', 'py-3'],
      },
      canHaveChildren: true,
    });
    Object.assign(this, init);
  }
}
