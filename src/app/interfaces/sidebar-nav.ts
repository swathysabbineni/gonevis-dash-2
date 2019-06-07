import { IconProp } from '@fortawesome/fontawesome-svg-core';
/**
 * Represents a sidebar navigation with routing icons
 */
export interface SidebarNav {
  label: string;
  route: string;
  icon: IconProp;
}
