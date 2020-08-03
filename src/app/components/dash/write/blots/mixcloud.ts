import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

class MixCloudBlot extends BlockEmbed {

  static blotName = 'mixcloud';
  static tagName = 'iframe';
  static className = 'mixcloud';

  static create(src: string): HTMLElement {
    const node: HTMLElement = super.create();
    node.setAttribute('src', src);
    node.setAttribute('height', '400');
    node.setAttribute('width', '100%');
    node.setAttribute('frameborder', '0');
    return node;
  }

  static value(domNode: HTMLElement): string {
    return domNode.getAttribute('src');
  }
}

Quill.register(MixCloudBlot, true);
