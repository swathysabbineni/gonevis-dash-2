import { IconDefinition } from '@fortawesome/fontawesome-common-types';

/**
 * Represents sidebar link structure
 *
 * @link DashComponent
 */
export interface SidebarLink {
  /** Path route */
  path: string;
  /** Label to display */
  label: string;
  /** Icon that represents the page */
  icon: IconDefinition;
}
