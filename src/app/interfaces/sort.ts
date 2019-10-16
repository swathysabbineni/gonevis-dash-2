import { IconDefinition } from '@fortawesome/fontawesome-common-types';

/**
 * Sorting for API
 */
export interface Sort {
  /**
   * API payload value
   */
  value: string;
  /**
   * Interface label
   */
  label: string;
  /**
   * Interface icon
   */
  icon?: IconDefinition;
}
