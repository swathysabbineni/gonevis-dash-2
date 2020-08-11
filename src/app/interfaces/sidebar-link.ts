import { IconDefinition } from '@fortawesome/fontawesome-common-types';

/**
 * Represents sidebar link structure
 */
export interface SidebarLink {
  /** Path route */
  path: string;
  /** Label to display */
  label: string;
  /** Icon that represents the page */
  icon: IconDefinition;
  /**
   * Show "new" badge
   */
  new?: true;
}
