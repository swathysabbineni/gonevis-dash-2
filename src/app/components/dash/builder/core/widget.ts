import { WidgetType } from 'src/app/components/dash/builder/core/widget-type';
import { Params } from 'src/app/interfaces/params';

export interface WidgetData {
  type: WidgetType;
  tagName: string;
  displayName: string;
  classList: string[];
  attributes: Params;
  styles: Params;
  canHaveChildren: boolean;
}

export class Widget {
  type: WidgetType;
  tagName: string;
  classList: string[];
  displayName: string;
  attributes: Params;
  styles: Params;
  canHaveChildren: boolean;

  constructor(data: WidgetData) {
    this.tagName = data.tagName;
    this.classList = data.classList;
    this.displayName = data.displayName;
    this.attributes = data.attributes;
    this.styles = data.styles;
    this.canHaveChildren = data.canHaveChildren;
  }
}
