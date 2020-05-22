import { WidgetConfigType } from '@app/components/dash/builder/shared/enums/widget-config-type';
import { WidgetID } from '@app/components/dash/builder/shared/enums/widget-id';
import { Widget } from './widget';

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
        },
        {
          id: 'text',
          label: 'Text',
          type: WidgetConfigType.TEXT,
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
