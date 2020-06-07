import { IconDefinition } from '@fortawesome/fontawesome-common-types';

/**
 * Represents keyboard shortcuts structure which is being used in editor to show user list of available shortcuts.
 */
export interface KeyboardShortcuts {
  /**
   * Shortcut icon which represents the button image responsible for the action.
   */
  icon: IconDefinition;
  /**
   * Name of the shortcuts, for example: 'Bold'
   */
  name: string;
  /**
   * List of keyboard keys that are required to perform the shortcut. For example: `Ctrl+B`
   */
  keys: string[];
}
