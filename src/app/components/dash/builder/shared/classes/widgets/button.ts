import { Widget } from '@builder/shared/classes/widget';
import { colors } from '@builder/shared/consts/colors';
import { WidgetConfigType } from '@builder/shared/enums/widget-config-type';
import { WidgetID } from '@builder/shared/enums/widget-id';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';

export class Button extends Widget {

  constructor(init: Widget) {
    super({
      id: WidgetID.BUTTON,
      name: 'Button',
      icon: faLink,
      tag: 'a',
      attributes: {
        class: ['btn'],
      },
      configs: [
        {
          id: 'label',
          label: 'Label',
          type: WidgetConfigType.TEXT,
          default: 'Button',
        },
        {
          id: 'type',
          label: 'Type',
          type: WidgetConfigType.LIST,
          options: colors,
          default: colors[0].value,
        },
        {
          id: 'link',
          label: 'Link',
          type: WidgetConfigType.TEXT,
        },
        {
          id: 'openInNewTab',
          label: 'Open in new tab',
          type: WidgetConfigType.CHECKBOX,
        },
      ],
    });
    Object.assign(this, init);
    console.log(this);
  }

  /**
   * @returns Rendered of element with configs applied to it
   */
  render(): string {
    this.text = this.values.label;
    this.attributes.href = this.values.link || '#';
    (this.attributes.class as string[])[1] = `btn-${this.values.type}`;
    if (this.values.openInNewTab) {
      this.attributes.target = '_blank';
    }
    return super.render();
  }
}
