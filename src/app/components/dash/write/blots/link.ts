import Quill from 'quill';

const Inline = Quill.import('blots/inline');

export interface LinkFormat {
  href: string;
  target: string;
}

/**
 * Link
 *
 * ## Purpose
 * It's purpose is to set and update link's target.
 *
 * ## How?
 * When user wants to create a new link, we provide an object as value.
 *
 * When user wants to edit a link, We create an object which its type is {@link LinkFormat}
 * from 'href' and 'target' attributes from DOM Node and convert the
 * object into a JSON string. {@link JSON.stringify}
 */
class Link extends Inline {
  static blotName = 'link';
  static tagName = 'A';

  static create(value: string): HTMLAnchorElement {
    /**
     * Create Inline Blot.
     */
    const node: HTMLAnchorElement = super.create();
    let newValue: string | LinkFormat;
    /**
     * Check if given value is a JSON string.
     *
     * @see JSON.stringify
     */
    if (isStringified(value)) {
      newValue = JSON.parse(value);
    } else {
      newValue = value;
    }
    /**
     * Check if given value's type is not an string.
     * (either the value was converted from JSON string into an object or it was an object)
     */
    if (typeof newValue !== 'string') {
      /**
       * Set 'href' and 'target' as attributes based on stored values.
       */
      node.setAttribute('href', newValue.href);
      node.setAttribute('target', newValue.target);
      return node;
    }
    /**
     * In case if given value's type was string.
     */
    node.setAttribute('href', newValue);
    return node;
  }

  /**
   * @param domNode DOM Node which is {@link HTMLAnchorElement}
   *
   * @returns JSON string which contains DOM Node 'href' and 'target' attribute values.
   */
  static formats(domNode: HTMLAnchorElement): string {
    return JSON.stringify({
      href: domNode.getAttribute('href'),
      target: domNode.getAttribute('target'),
    });
  }

  /**
   * Format link blot based on given formats.
   *
   * @param name Format name
   * @param value Format value
   */
  format(name: string, value: any): void {
    if (name !== this.statics.blotName || !value) {
      return super.format(name, value);
    }
    let newValue: string | LinkFormat;
    /**
     * Check if given value is a JSON string.
     *
     * @see JSON.stringify
     */
    if (isStringified(value)) {
      newValue = JSON.parse(value);
    } else {
      newValue = value;
    }
    /**
     * Check if given value's type is not an string.
     * (either the value was converted from JSON string into an object or it was an object)
     */
    if (typeof newValue !== 'string') {
      /**
       * Set 'href' and 'target' as attributes based on stored values.
       */
      this.domNode.setAttribute('href', newValue.href);
      this.domNode.setAttribute('target', newValue.target);
    } else {
      this.domNode.setAttribute('href', newValue);
    }
  }
}

/**
 * Determines whether or not the given value is JSON string.
 *
 * @param value Value
 */
function isStringified(value: string): boolean {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}

Quill.register(Link, true);
