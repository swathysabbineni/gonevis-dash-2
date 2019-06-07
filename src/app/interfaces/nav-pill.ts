import { IconProp } from '@fortawesome/fontawesome-svg-core';
/**
 * Represents a navigation pill with routing icons
 */
export interface NavPill {
  label: string;
  route: string;
  icon: IconProp;
}
