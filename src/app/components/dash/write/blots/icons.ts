import { CustomIcon } from '@app/interfaces/custom-icon';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons/faAlignCenter';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons/faAlignJustify';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons/faAlignLeft';
import { faAlignRight } from '@fortawesome/free-solid-svg-icons/faAlignRight';
import { faBold } from '@fortawesome/free-solid-svg-icons/faBold';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faItalic } from '@fortawesome/free-solid-svg-icons/faItalic';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl';
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faParagraph } from '@fortawesome/free-solid-svg-icons/faParagraph';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons/faQuoteRight';
import { faRemoveFormat } from '@fortawesome/free-solid-svg-icons/faRemoveFormat';
import { faStrikethrough } from '@fortawesome/free-solid-svg-icons/faStrikethrough';
import { faUnderline } from '@fortawesome/free-solid-svg-icons/faUnderline';
import Quill, { StringMap } from 'quill';

/**
 * Quill icons
 */
const Icons: StringMap = Quill.import('ui/icons');

/**
 * List of icons to change
 */
const customIcons: CustomIcon[] = [{
  default: 'bold',
  new: faBold,
}, {
  default: 'italic',
  new: faItalic,
}, {
  default: 'underline',
  new: faUnderline,
}, {
  default: 'strike',
  new: faStrikethrough,
}, {
  default: 'blockquote',
  new: faQuoteRight,
}, {
  default: 'link',
  new: faLink,
}, {
  default: 'code-block',
  new: faCode,
}, {
  default: 'divider',
  new: faMinus,
}, {
  default: 'image',
  new: faImage,
}, {
  default: 'video',
  new: faExternalLinkAlt,
}, {
  default: 'clean',
  new: faRemoveFormat,
}];

/**
 * Convert given icon to SVG element which contains a path element
 *
 * @param icon FortAwesome icon
 * @param classList List of classes to attach to SVG element
 *
 * @see IconDefinition
 * @link https://github.com/FortAwesome/angular-fontawesome/blob/master/docs/usage.md
 *
 * @returns SVG element based on given icon
 */
export function iconToSVGElement(icon: IconDefinition, classList?: string): SVGSVGElement {
  /**
   * Create SVG element
   */
  const node: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  /**
   * Add classes
   */
  node.classList.add('svg-inline--fa', 'fa-fw', `${icon.prefix}-${icon.iconName}`);
  if (classList) {
    node.classList.add(classList);
  }
  /**
   * Set node viewBox
   */
  node.setAttribute('viewBox', `0 0 ${icon.icon[0]} ${icon.icon[1]}`);
  /**
   * Create Path element
   */
  const path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  /**
   * Set `fill` attribute's value to `currentColor` so it can adjustable
   */
  path.setAttributeNS(null, 'fill', 'currentColor');
  /**
   * Set `d` attribute's value to given icon's path commands
   *
   * 'd' is a string containing a series of path commands that define the path to be drawn
   */
  path.setAttributeNS(null, 'd', icon.icon[icon.icon.length - 1] as string);
  /**
   * Append {@link path} to {@link node} as a child
   */
  node.appendChild<SVGPathElement>(path);
  /**
   * Return node
   */
  return node;
}

/**
 * Loop into {@link customIcons} and change default icons
 */
customIcons.forEach((icon: CustomIcon): void => {
  Icons[icon.default] = iconToSVGElement(icon.new).outerHTML;
});

Icons.list.ordered = iconToSVGElement(faListOl).outerHTML;
Icons.list.bullet = iconToSVGElement(faListUl).outerHTML;
Icons.direction[''] = iconToSVGElement(faParagraph).outerHTML;
Icons.direction.rtl = iconToSVGElement(faParagraph, 'fa-flip-horizontal').outerHTML;
Icons.align[''] = iconToSVGElement(faAlignLeft).outerHTML;
Icons.align.center = iconToSVGElement(faAlignCenter).outerHTML;
Icons.align.right = iconToSVGElement(faAlignRight).outerHTML;
Icons.align.justify = iconToSVGElement(faAlignJustify).outerHTML;

Quill.register(Icons, true);
