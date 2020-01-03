import { iconToSVGElement } from '@app/components/dash/write/blots/icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import ScrollBlot from 'parchment/dist/src/blot/scroll';
import Quill, { StringMap, QuillOptionsStatic, RangeStatic, BoundsStatic } from 'quill';
import Emitter from 'quill/core/emitter';
import { Range } from 'quill/core/selection';
import Link from 'quill/formats/link';
import { BaseTooltip } from 'quill/themes/base';

const SnowTheme = Quill.import('themes/snow');
const LinkBlot = Quill.import('formats/link');

/**
 * Quill icons
 */
const Icons: StringMap = Quill.import('ui/icons');

const tooltipEditIcon = `<span class="ql-action-edit">${iconToSVGElement(faPen).outerHTML}</span>`;
const tooltipSaveIcon = `<span class="ql-action-save">${iconToSVGElement(faCheck).outerHTML}</span>`;
const tooltipDeleteIcon = iconToSVGElement(faTimes).outerHTML;

/**
 * Represents custom tooltip interface
 */
interface TooltipInterface {
  preview: HTMLAnchorElement;
  quill: Quill;
  root: HTMLElement;
  linkRange: RangeStatic;
  TEMPLATE: string;

  listen(): void;

  show(): void;

  hide(): void;

  save(): void;

  restoreFocus(): void;

  position(bounds: BoundsStatic): number;

  edit(mode: string, preview: string): void;
}

/**
 * @description
 *
 * Custom tooltip which is called BootstrapTooltip that extends BaseTooltip
 */
class BootstrapTooltip extends BaseTooltip implements TooltipInterface {

  /**
   * Tooltip's DOM template
   */
  static TEMPLATE: string;

  /**
   * Preview link element
   */
  preview: HTMLAnchorElement;

  /**
   * Quill
   */
  quill: Quill;

  /**
   * Tooltip's root DOM element
   */
  root: HTMLElement;

  /**
   * Link element's range statistics
   */
  linkRange: RangeStatic;

  constructor(quill: Quill, bounds: HTMLElement | string) {
    super(quill, bounds);
    /**
     * Find preview element
     */
    this.preview = this.root.querySelector('a.ql-preview');
  }

  TEMPLATE: string;

  /**
   * @description
   *
   * Listen to click events and conditionally update links/videos/formulas
   */
  listen(): void {
    super.listen();
    this.root.querySelector('button.ql-action').addEventListener('click', (event: MouseEvent): void => {
      if (this.root.classList.contains('ql-editing')) {
        this.save();
      } else {
        this.edit('link', this.preview.textContent);
      }
      event.preventDefault();
    });
    this.root.querySelector('button.ql-remove').addEventListener('click', (event: MouseEvent): void => {
      if (this.linkRange != null) {
        const range: RangeStatic = this.linkRange;
        this.restoreFocus();
        this.quill.formatText(range, 'link', false, Emitter.sources.USER);
        delete this.linkRange;
      }
      event.preventDefault();
      this.hide();
    });
    this.quill.on(Emitter.events.SELECTION_CHANGE,
      (range: RangeStatic, oldRange: RangeStatic, source: string): void => {
        if (range == null) {
          return;
        }
        if (range.length === 0 && source === Emitter.sources.USER) {
          const [link, offset] = (this.quill.scroll as ScrollBlot).descendant(LinkBlot, range.index);
          if (link != null) {
            this.linkRange = new Range(range.index - offset, link.length());
            const preview: string = LinkBlot.formats(link.domNode);
            this.preview.textContent = preview;
            this.preview.setAttribute('href', preview);
            this.show();
            this.position(this.quill.getBounds(this.linkRange.index, this.linkRange.length));
            return;
          }
        } else {
          delete this.linkRange;
        }
        this.hide();
      });
  }

  /**
   * Show tooltip DOM element
   */
  show(): void {
    super.show();
    this.root.removeAttribute('data-mode');
  }

  /**
   * Hide tooltip DOM element
   */
  hide(): void {
    super.hide();
  }

  /**
   * Save changes
   */
  save(): void {
    super.save();
  }

  /**
   * Restore focus back to editor
   */
  restoreFocus(): void {
    super.restoreFocus();
  }

  /**
   * Position tooltip DOM element based on given bounds statistics
   *
   * @param bounds Bounds statistics
   *
   * @returns Number that shows X shift
   */
  position(bounds: BoundsStatic): number {
    return super.position(bounds);
  }

  /**
   * Change to edit mode
   *
   * @param mode Current mode
   * @param preview Preview DOM element
   */
  edit(mode = 'link', preview = null): void {
    super.edit(mode, preview);
  }
}

/**
 * Bootstrap tooltip template
 */
BootstrapTooltip.TEMPLATE = [
  '<a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a>',
  '<input type="text" class="form-control form-control-sm" ' +
  'data-formula="e=mc^2" data-link="https://google.com" data-video="Embed URL">',
  `<button class="ql-action btn btn-link btn-sm ml-2">${tooltipEditIcon}${tooltipSaveIcon}</button>`,
  `<button class="ql-remove btn btn-link btn-sm">${tooltipDeleteIcon}</button>`,
].join('');


/**
 * @description
 *
 * Custom theme which is called Bootstrap that extends Snow theme
 */
export default class BootstrapTheme extends SnowTheme {

  /**
   * Quill instance
   */
  quill: Quill;

  /**
   * Quill options
   */
  options: QuillOptionsStatic;

  constructor(quill: Quill, options: QuillOptionsStatic) {
    super(quill, options);
  }

  /**
   * @description
   *
   * Update toolbar class and add button and icons to it and configure it manually
   */
  extendToolbar(toolbar: StringMap): void {
    /**
     * Add 'ql-snow' class to toolbar DOM element
     */
    toolbar.container.classList.add('ql-snow');
    /**
     * Build buttons and pickers with QuillJS icons
     */
    this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), Icons);
    this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), Icons);
    /**
     * Setup tooltip
     */
    // this.tooltip = new BootstrapTooltip(this.quill, this.options.bounds);
    /**
     * Check if toolbar contains link format
     */
    if (toolbar.container.querySelector('.ql-link')) {
      /**
       * Add key shortcut binding 'K' to link
       */
      this.quill.keyboard.addBinding({ key: 'K', shortKey: true }, (range: RangeStatic, context: any): void => {
        toolbar.handlers.link.call(toolbar, !context.format.link);
      });
    }
  }
}
