import { Widget } from '@builder/shared/classes/widget';
import { WidgetConfigType } from '@builder/shared/enums/widget-config-type';
import { WidgetID } from '@builder/shared/enums/widget-id';
import { faHeading } from '@fortawesome/free-solid-svg-icons/faHeading';

export class Heading extends Widget {

  constructor(init: Partial<Widget>) {
    super({
      id: WidgetID.HEADING,
      name: 'Heading',
      icon: faHeading,
      configs: [
        {
          id: 'type',
          label: 'Type',
          type: WidgetConfigType.LIST,
          options: [
            { value: 1, label: 'Heading 1' },
            { value: 2, label: 'Heading 2' },
            { value: 3, label: 'Heading 3' },
            { value: 4, label: 'Heading 4' },
            { value: 5, label: 'Heading 5' },
          ],
          default: 1,
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
