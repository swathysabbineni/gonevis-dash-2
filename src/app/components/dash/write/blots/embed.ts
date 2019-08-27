import { environment } from '@environments/environment';
import Quill from 'quill';

const iframeOrigin = environment.api.v1.split('/api/v1/')[0] + '/toodartoo/embed/?media=';
const BlockEmbed = Quill.import('blots/block/embed');

/**
 * Embed
 *
 * @description
 *
 * ## Purpose
 * It's purpose is to embed Github Gists, Twitter Tweets and Instagram posts.
 *
 * ## How?
 * When user pastes/provides an embed url, we create an iframe tag with these attributes:
 * - ### src
 *   It's value looks like this (`MEDIA_URL` is the URL that user pastes/provides):
 *   `https://www.gonevis.com/toodartoo/embed/?media=MEDIA_URL`
 *
 * - ### width
 *   We set it's value too `100%` so that the iframe could fit to it's mother element.
 *
 * - ### data-embed-url
 *   We set it's value to the URL that user pastes/provides.
 *
 * - ### frameborder
 *   We set it's value to `0` so that the iframe doesn't have any borders around itself.
 */
class Embed extends BlockEmbed {
  static blotName = 'embed';
  static tagName = 'iframe';

  static create(url: string): HTMLIFrameElement {
    const node: HTMLIFrameElement = super.create();
    // Handle node's url
    let src: string = url;
    if (!url.includes(iframeOrigin)) {
      src = iframeOrigin + url;
    }
    // Set iframe's attributes
    node.src = src;
    node.width = '100%';
    node.setAttribute('data-embed-url', src.split(iframeOrigin)[1]);
    node.setAttribute('frameborder', '0');
    // Add node
    return node;
  }

  static value(domNode: HTMLElement): string {
    if (domNode.getAttribute('src')) {
      return domNode.getAttribute('src');
    }
  }
}

Quill.register(Embed, true);
