import { Widget } from '@builder/shared/classes/widget';
import { Button } from '@builder/shared/classes/widgets/button';
import { Card } from '@builder/shared/classes/widgets/card';
import { Container } from '@builder/shared/classes/widgets/container';
import { Heading } from '@builder/shared/classes/widgets/heading';
import { Space } from '@builder/shared/classes/widgets/space';
import { WidgetID } from '@builder/shared/enums/widget-id';

export const widgets: Record<WidgetID, typeof Widget> = {
  [WidgetID.BUTTON]: Button,
  [WidgetID.CARD]: Card,
  [WidgetID.CONTAINER]: Container,
  [WidgetID.SPACE]: Space,
  [WidgetID.HEADING]: Heading,
};
