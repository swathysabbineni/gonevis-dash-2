import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

class VideoBlot extends BlockEmbed {

  static blotName = 'video';
  static tagName = 'div';

  static create(url: string): HTMLElement {
    const node: HTMLElement = super.create(url);
    const iframe: HTMLIFrameElement = document.createElement('iframe');
    // Set styles for wrapper
    node.setAttribute('class', 'embed-responsive embed-responsive-16by9');
    // Set styles for iframe
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('webkitallowfullscreen', 'true');
    iframe.setAttribute('mozallowfullscreen', 'true');
    iframe.setAttribute('src', url);
    // Append iframe as child to wrapper
    node.appendChild(iframe);
    return node;
  }

  static value(domNode: HTMLElement): string {
    if (domNode.querySelector('iframe')) {
      return domNode.querySelector('iframe').getAttribute('src');
    }
  }
}

Quill.register(VideoBlot, true);
