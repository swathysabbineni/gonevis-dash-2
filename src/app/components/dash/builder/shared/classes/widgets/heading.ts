import { Widget } from '@builder/shared/classes/widget';
import { WidgetConfigType } from '@builder/shared/enums/widget-config-type';
import { WidgetID } from '@builder/shared/enums/widget-id';

export class Heading extends Widget {

  constructor(init: Partial<Widget>) {
    super({
      id: WidgetID.HEADING,
      name: 'Heading',
      configs: [
        {
          id: 'type',
          label: 'Type',
          type: WidgetConfigType.LIST,
          options: ['1', '2', '3', '4', '5', '6'],
          default: '1',
        },
        {
          id: 'text',
          label: 'Text',
          type: WidgetConfigType.TEXT,
          default: 'Heading Text',
        },
      ],
    });
    Object.assign(this, init);
  }

  render(): string {
    this.tag = `h${this.values.type || 1}`;
    this.text = this.values.text;
    return super.render();
  }
}
