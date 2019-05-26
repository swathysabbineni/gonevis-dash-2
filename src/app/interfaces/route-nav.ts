import { IconProp } from '@fortawesome/fontawesome-svg-core';

/**
 * Represents a navigation item with routing icons
 */
export interface RouteNav {
  label: string;
  route: string;
  icon: IconProp;
}
