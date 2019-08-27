import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

class SoundCloudBlot extends BlockEmbed {

  static blotName = 'soundcloud';
  static tagName = 'soundcloud';

  static create(iframe: HTMLIFrameElement | string): HTMLElement {
    const node: HTMLElement = super.create();

    if (typeof iframe === 'object') {
      node.appendChild(iframe as HTMLIFrameElement);
    } else {
      node.innerHTML = iframe as string;
    }
    // Add node
    return node;
  }

  static value(domNode: HTMLElement): HTMLIFrameElement {
    if (domNode.querySelector('iframe')) {
      return domNode.querySelector('iframe');
    }
  }
}

Quill.register(SoundCloudBlot, true);
