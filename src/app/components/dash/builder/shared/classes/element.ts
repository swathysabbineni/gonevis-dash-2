export class Element {

  constructor(init?: Partial<Element>) {
    Object.assign(this, init);
  }

  tag: string;
  text: string;
  attributes: { [name: string]: string | string[] | number };
  children: Element[];

  static render(elements: Element[]): string {
    let output = '';
    for (const element of elements) {
      output += element.render();
    }
    console.log(JSON.stringify(elements));
    return output;
  }

  render(): string {
    /**
     * Render attributes
     */
    let attributes = '';
    if (this.attributes) {
      attributes = ' ';
      const attributesKeys: string[] = Object.keys(this.attributes);
      for (const attributeKey of attributesKeys) {
        const attribute: string | string[] | number = this.attributes[attributeKey];
        let value: string = String(attribute);
        if (typeof attribute === 'object') {
          value = attribute.join(' ');
        }
        attributes += `${attributeKey}="${value}"`;
        if (attributesKeys.indexOf(attributeKey) !== attributesKeys.length - 1) {
          attributes += ' ';
        }
      }
    }
    /**
     * Render inner HTML
     */
    let inner = '';
    if (this.text) {
      inner = this.text;
    } else if (this.children) {
      inner = Element.render(this.children);
    }
    /**
     * Return the rendered output
     */
    return `<${this.tag}${attributes}>${inner}</${this.tag}>`;
  }
}
