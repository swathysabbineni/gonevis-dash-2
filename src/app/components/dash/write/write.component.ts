import { style, animate, transition, trigger, query, stagger } from '@angular/animations';
import {
  TAB,
  ENTER,
  FIVE,
  L,
  E,
  R,
  J,
  CLOSE_SQUARE_BRACKET,
  OPEN_SQUARE_BRACKET,
  BACKSLASH,
  SEVEN,
  EIGHT,
  NINE,
} from '@angular/cdk/keycodes';
import { TemplatePortal, CdkPortalOutlet, CdkPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  Renderer2,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  ViewContainerRef,
  Inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { MediaService } from '@app/components/dash/media/media.service';
import '@app/components/dash/write/blots/divider.ts';
import '@app/components/dash/write/blots/embed.ts';
import '@app/components/dash/write/blots/icons.ts';
import '@app/components/dash/write/blots/soundcloud.ts';
import '@app/components/dash/write/blots/video.ts';
import { KeyManagerComponent } from '@app/components/dash/write/core/key-manager.component';
import '@app/components/dash/write/modules/clipboard.ts';
import { ShortcutsComponent } from '@app/components/dash/write/shared/components/shortcuts/shortcuts.component';
import '@app/components/dash/write/themes/bootstrap.ts';
import { WriteService } from '@app/components/dash/write/write.service';
import { DashUiStatus } from '@app/enums/dash-ui-status';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { ApiResponse } from '@app/interfaces/api-response';
import { File as FileMedia } from '@app/interfaces/file';
import { Params } from '@app/interfaces/params';
import { SoundCloudEmbed } from '@app/interfaces/sound-cloud-embed';
import { Entry } from '@app/interfaces/v1/entry';
import { Tag } from '@app/interfaces/v1/tag';
import { BlogService } from '@app/services/blog/blog.service';
import { FileSelectionComponent } from '@app/shared/file-selection/file-selection.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons/faAlignCenter';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons/faAlignJustify';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons/faAlignLeft';
import { faAlignRight } from '@fortawesome/free-solid-svg-icons/faAlignRight';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faBorderStyle } from '@fortawesome/free-solid-svg-icons/faBorderStyle';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faDraftingCompass } from '@fortawesome/free-solid-svg-icons/faDraftingCompass';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faFont } from '@fortawesome/free-solid-svg-icons/faFont';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faHeading } from '@fortawesome/free-solid-svg-icons/faHeading';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faIndent } from '@fortawesome/free-solid-svg-icons/faIndent';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons/faNewspaper';
import { faOutdent } from '@fortawesome/free-solid-svg-icons/faOutdent';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons/faQuoteLeft';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons/faSlidersH';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { faUnlink } from '@fortawesome/free-solid-svg-icons/faUnlink';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';
import { TranslateService } from '@ngx-translate/core';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { QuillModules } from 'ngx-quill';
import { Range } from 'ngx-quill/src/quill-editor.component';
import { ToastrService } from 'ngx-toastr';
import Parchment from 'parchment';
import BlockBlot from 'parchment/dist/src/blot/block';
import InlineBlot from 'parchment/dist/src/blot/inline';
import { Blot } from 'parchment/src/blot/abstract/blot';
import QuillClass, { Quill, RangeStatic, BoundsStatic, StringMap, DeltaOperation, DeltaStatic } from 'quill';
import Delta from 'quill-delta';
import { bubbleFormats } from 'quill/blots/block';
import { debounceTime } from 'rxjs/operators';

const QuillParchment: typeof Parchment = QuillClass.import('parchment');
const Block: new (domNode?: HTMLElement) => BlockBlot = QuillParchment.Block;
const Inline: new (domNode?: HTMLElement) => InlineBlot = QuillParchment.Inline;

/**
 * Represents header values which are being used for keyboard shortcuts and setting header buttons as active.
 */
enum HeaderKey {
  H1 = '1',
  H2 = '2',
  H3 = '3',
  H4 = '4',
  H5 = '5',
  H6 = '6',
  PARAGRAPH = '0',
}

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss'],
  animations: [
    trigger('scaleIn', [
      transition('false => true', [
        query('button', [
          style({ transform: 'scale(0)' }),
          stagger(75, [
            animate('100ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'scale(1)' })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class WriteComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Editor embed whitelist
   */
  private static EMBED_WHITELIST = [
    'https://gist.github.com/',
    'https://www.instagram.com/p/',
    'https://twitter.com/',
    'https://pastebin.com/',
  ];

  /**
   * Determines whether or not shortcuts modal is open. It's to prevent 'Ctrl+/' shortcut
   * from opening multiple shortcuts modal.
   */
  private isShortcutsModalOpen: boolean;

  /**
   * An un-listen function for disposing of keydown listener.
   * On component destroy, we call this function to dispose.
   */
  private keydownListener: () => void;

  /**
   * An un-listen function for disposing of keydown listener.
   * On component destroy, we call this function to dispose.
   */
  private shortcutsModalKeydownListener: () => void;

  /**
   * Icons for inline
   */
  readonly faChevronDown: IconDefinition = faChevronDown;
  readonly faLink: IconDefinition = faLink;
  readonly faPencilAlt: IconDefinition = faPencilAlt;
  readonly faUnlink: IconDefinition = faUnlink;
  readonly faCopy: IconDefinition = faCopy;
  readonly faGlobe: IconDefinition = faGlobe;
  readonly faHeading: IconDefinition = faHeading;
  readonly faAlignLeft: IconDefinition = faAlignLeft;
  readonly faAlignCenter: IconDefinition = faAlignCenter;
  readonly faAlignRight: IconDefinition = faAlignRight;
  readonly faAlignJustify: IconDefinition = faAlignJustify;
  readonly faIndent: IconDefinition = faIndent;
  readonly faOutdent: IconDefinition = faOutdent;
  readonly faFont: IconDefinition = faFont;
  readonly faCode: IconDefinition = faCode;
  readonly faMinus: IconDefinition = faMinus;
  readonly faListUl: IconDefinition = faListUl;
  readonly faQuoteLeft: IconDefinition = faQuoteLeft;
  readonly faImage: IconDefinition = faImage;
  readonly times: IconDefinition = faTimes;
  readonly image: IconDefinition = faImage;
  readonly plus: IconDefinition = faPlus;
  readonly undo: IconDefinition = faUndo;
  readonly check: IconDefinition = faCheck;
  readonly faSlidersH: IconDefinition = faSlidersH;
  readonly faExternalLinkAlt: IconDefinition = faExternalLinkAlt;
  readonly faArrowLeft: IconDefinition = faArrowLeft;
  readonly faEye: IconDefinition = faEye;
  readonly faUpload: IconDefinition = faUpload;
  readonly faSave: IconDefinition = faSave;
  readonly faDraftingCompass: IconDefinition = faDraftingCompass;
  readonly faNewspaper: IconDefinition = faNewspaper;
  readonly faBorderStyle: IconDefinition = faBorderStyle;
  readonly faKeyboard: IconDefinition = faKeyboard;

  /**
   * Current entry ID
   */
  private id: string;

  /**
   * Original entry
   */
  private oldForm: Params;

  /**
   * Quill instance
   */
  private editor: Quill;

  /**
   * Auto save interval
   */
  private autoSaveInterval: any;

  /**
   * Auto saving indicator
   */
  private autoSave: boolean;

  /**
   * Current cursor index
   */
  private cursorIndex: number;

  readonly entryStatus = EntryStatus;

  @ViewChild('settingsTemplate') private settingsTemplate: TemplateRef<any>;

  @ViewChild('fileListModalTemplate') private fileListModalTemplate: TemplateRef<any>;

  @ViewChild('sideBarControls') private sideBarControls: ElementRef;

  /**
   * Commenting out selection bubble behavior and keeping it for future features.
   * Get selection bubble element
   */
    // @ViewChild('selectionBubble') private selectionBubble: ElementRef;

  @ViewChild('linkBubble') private linkBubble: ElementRef;

  /**
   * Get template reference responsible for holding link edit mode
   */
  @ViewChild('linkEditTemplateRef') private linkEditTemplateRef: TemplateRef<any>;

  /**
   * Get template reference responsible for holding link preview mode
   */
  @ViewChild('linkPreviewTemplateRef') private linkPreviewTemplateRef: TemplateRef<any>;

  @ViewChild('linkUrlInput') private linkUrlInput: ElementRef;

  @ViewChild('caret') private caret: ElementRef;

  @ViewChild('keyManagerComponent') private keyManagerComponent: KeyManagerComponent;

  /**
   * Get selection tooltip key manager
   */
  // @ViewChild('keyManagerComponentBubble') private keyManagerComponentBubble: KeyManagerComponent;

  /**
   * Determines whether user was creating post or not
   */
  private wasCreating: boolean;

  readonly headerKey = HeaderKey;

  /**
   * All formats that contains in selected text
   */
  selectionFormats: StringMap = {};

  /**
   * Determines whether or not to show selection tooltip
   */
  // showSelectionBubble: boolean;

  /**
   * Determines whether or not to show link bubble
   */
  showLinkBubble: boolean;

  /**
   * Portal outlet which is a host for hosting either
   * {@link linkPreviewTemplatePortal} or {@link linkEditTemplatePortal}
   *
   * @see CdkPortalOutlet
   * @see CdkPortal
   */
  selectedLinkPortalOutlet: TemplatePortal<any> = null;

  /**
   * Determines whether or not to show add button next to current caret positions
   */
  showComposeContainer: boolean;

  /**
   * Determines whether or not to show add button next to current caret positions
   */
  showComposeOptions: boolean;

  /**
   * Determines whether or not to show caret blink
   */
  showCaret: boolean;

  /**
   * Old entry
   */
  oldEntry: Entry;

  /**
   * File list modal
   */
  fileListModalRef: BsModalRef;

  /**
   * Tag list
   */
  tags: Tag[] = [];

  /**
   * Tag query form
   */
  tagQueryControl: FormControl = new FormControl('');

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Determines whether or not entry loaded from API call.
   */
  entryLoaded: boolean;

  /**
   * Determines whether or not editor is initialized.
   */
  editorInit: boolean;

  /**
   * Determine whether editing or creating new entry
   */
  isEditing: boolean;

  /**
   * Indicates whether entry changed or not
   */
  postChanged: boolean;

  /**
   * Determines whether page scrolled or not.
   */
  scrolled: boolean;

  /**
   * Quill modules
   */
  options: QuillModules = {
    history: {
      delay: 200,
      maxStack: 2000,
    },
    markdownShortcuts: {},
    keyboard: {
      /**
       * Indent code block - TAB (not with Shift key)
       */
      bindings: {
        'indent code-block': this.makeCodeBlockHandler(true),
        'outdent code-block': this.makeCodeBlockHandler(false),
        /**
         * Tab handler for all blocks except code block.
         * This is being used to open {@link showComposeOptions compose options} without clicking the compose button.
         */
        tab: {
          key: TAB,
          format: { 'code-block': false },
          handler: (range: Range): void => {
            /**
             * Check if compose container is opened, if it is then it means user is on a fresh new line.
             * Otherwise perform the default tab behavior.
             */
            if (this.showComposeContainer) {
              this.showComposeOptions = true;
              this.changeDetectorRef.detectChanges();
              /**
               * Focus on first option so it would be easier for user to start
               */
              this.keyManagerComponent.setActiveItem(0);
            } else {
              this.defaultTabHandler(range);
            }
            // if (this.showSelectionBubble) { /** Open selection tooltip */
            //   /**
            //    * Focus on first option
            //    */
            //   this.keyManagerComponentBubble.setActiveItem(0);
            //   this.changeDetectorRef.detectChanges();
            // }
          },
        },
        /**
         * On block quote enter check if no block quotes exist in the next line and break the block quote chain.
         * Otherwise create a block quote.
         */
        'blockquote empty enter': {
          key: ENTER,
          collapsed: true,
          format: ['blockquote'],
          handler: (range: RangeStatic, context: any): any => {
            if (!context.suffix) {
              this.editor.insertText(range.index + 1, '\n', 'user');
              this.editor.setSelection(range.index + 1, 0, 'silent');
            } else {
              this.editor.insertText(range.index, '\n', 'user');
              this.editor.setSelection(range.index + 1, 0, 'silent');
            }
          },
        },
        /**
         * CTRL+Shift+5
         */
        strikethrough: {
          key: FIVE,
          shiftKey: true,
          altKey: true,
          handler: (range: RangeStatic, context: any): void => {
            this.editor.format('strike', !context.format.strike, 'user');
          },
        },
        /**
         * Align left - CTRL+Shift+L
         */
        alignLeft: {
          key: L,
          shiftKey: true,
          ctrlKey: true,
          handler: (range: RangeStatic): void => {
            this.format('align', '');
          },
        },
        /**
         * Align center - CTRL+Shift+E
         */
        alignCenter: {
          key: E,
          shiftKey: true,
          ctrlKey: true,
          handler: (range: RangeStatic): void => {
            this.format('align', 'center');
          },
        },
        /**
         * Align right - CTRL+Shift+R
         */
        alignRight: {
          key: R,
          shiftKey: true,
          ctrlKey: true,
          handler: (range: RangeStatic): void => {
            this.format('align', 'right');
          },
        },
        /**
         * Justify - CTRL+Shift+J
         */
        justify: {
          key: J,
          shiftKey: true,
          ctrlKey: true,
          handler: (range: RangeStatic): void => {
            this.format('align', 'justify');
          },
        },
        /**
         * Increase indent - CTRL+]
         */
        increaseIndent: {
          key: CLOSE_SQUARE_BRACKET,
          ctrlKey: true,
          handler: (range: RangeStatic): void => {
            this.format('indent', '+1');
          },
        },
        /**
         * Decrease indent - CTRL+[
         */
        decreaseIndent: {
          key: OPEN_SQUARE_BRACKET,
          ctrlKey: true,
          handler: (range: RangeStatic): void => {
            this.format('indent', '-1');
          },
        },
        /**
         * Remove formatting - CTRL+\
         */
        removeFormatting: {
          key: BACKSLASH,
          ctrlKey: true,
          handler: (range: RangeStatic): void => this.removeFormatting(range),
        },
        /**
         * Ordered list - CTRL+Shift+7
         */
        listOrdered: {
          key: SEVEN,
          shiftKey: true,
          ctrlKey: true,
          handler: (range: RangeStatic, context: any): void => {
            let value: boolean | string = 'ordered';
            /**
             * If list's format was already ordered then just remove it's format. (toggle)
             */
            if (context.format.list === 'ordered') {
              value = false;
            }
            this.editor.format('list', value, 'user');
          },
        },
        /**
         * Bullet list - CTRL+Shift+8
         */
        listBullet: {
          key: EIGHT,
          shiftKey: true,
          ctrlKey: true,
          handler: (range: RangeStatic, context: any): void => {
            let value: boolean | string = 'bullet';
            /**
             * If list's format was already bullet then just remove it's format. (toggle)
             */
            if (context.format.list === 'bullet') {
              value = false;
            }
            this.editor.format('list', value, 'user');
          },
        },
        /**
         * Blockquote - CTRL+Shift+9
         */
        blockquote: {
          key: NINE,
          shiftKey: true,
          ctrlKey: true,
          handler: (range: RangeStatic, context: any): void => {
            this.editor.format('blockquote', !context.format.blockquote, 'user');
          },
        },
      },
    },
    toolbar: {
      container: '.toolbar',
      handlers: {
        divider: (): void => this.insertDivider(),
        video: (): void => {
          // In case if editor was not yet initialized.
          if (!this.editor) {
            return;
          }
          this.displayLinkInsert(this.editor.getSelection(true), '', '', true);
        },
      },
    },
  };

  /**
   * Entry form which contains all the editable fields for an entry
   */
  form: FormGroup;

  /**
   * Entry's cover image
   */
  coverImage: FileMedia;

  /**
   * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
   * In our case the embedded template is {@link linkEditTemplateRef}
   */
  linkEditTemplatePortal: TemplatePortal<any>;

  /**
   * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
   * In our case the embedded template is {@link linkPreviewTemplateRef}
   */
  linkPreviewTemplatePortal: TemplatePortal<any>;

  /**
   * Determines whether or not entry has changed.
   *
   * This is being used to either show or hide entry's current state at toolbar. (where it says: Saved, Saving...)
   */
  hasUnsavedChanges: boolean;

  /**
   * Extract YouTube/Vimeo URL from given string
   *
   * @param url URL address to extract
   */
  private static extractVideoUrl(url: string): string {
    /**
     * Vimeo regular expression
     */
    const vimeoRegExp: RegExp = new RegExp(/(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i);
    /**
     * YouTube regular expression
     */
    const youTubeRegExp: RegExp = new RegExp(
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
    );
    if (youTubeRegExp.test(url)) {
      return `https://www.youtube.com/embed/${RegExp.$7}?autoplay=0`;
    } else if (vimeoRegExp.test(url)) {
      return `https://player.vimeo.com/video/${RegExp.$1}`;
    }
    return null;
  }

  /**
   * Auto save post/page every 10 seconds
   */
  private initAutoSave(): void {
    // Auto save every 10 seconds
    this.autoSaveInterval = setInterval((): void => {
      // Check if already updating
      if (!this.loading) {
        if (this.form.get('content').value) {
          // Check if entry has an unsaved changes
          if (!equal(this.oldForm, this.form.value)) {
            this.autoSave = true;
            this.save();
          }
        }
      }
    }, 10000);
  }

  // Host listener which will listen to 'message' event
  @HostListener('window:message', ['$event'])
  embedListeners(event: MessageEvent): void {
    // Check if  there is 'elementId' in event's 'data' property
    if (event.data.elementId) {
      // Element with specific attribute
      this.elementRef.nativeElement.querySelectorAll(`[data-embed-url='${event.data.elementId}']`).forEach(
        (element: Element): void => {
          // Update element's 'height' style property
          element.setAttribute('height', `${event.data.height}px`);
          this.onWindowResize();
        },
      );
    }
  }

  /**
   * Host listener which listens to window resize and will re-locate the {@link caret custom caret}
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    /**
     * Wait until editor instantiates.
     */
    if (!this.editor) {
      return;
    }
    this.displayCaret(this.editor);
    /**
     * Re-locate {@link linkPreviewTemplatePortal}
     */
    const previewTemplateContext = this.linkPreviewTemplatePortal.context;
    if (previewTemplateContext && previewTemplateContext.$implicit) {
      /**
       * Get index of current selected link element so we can re-locate it.
       */
      const index = previewTemplateContext.$implicit.blot.offset(this.editor);
      this.setBubblePosition(this.linkBubble.nativeElement, { index, length: 0 });
    }
  }

  constructor(private elementRef: ElementRef,
              private renderer2: Renderer2,
              private viewContainerRef: ViewContainerRef,
              private title: Title,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private translateService: TranslateService,
              private mediaService: MediaService,
              private writeService: WriteService,
              private toast: ToastrService,
              @Inject(DOCUMENT) private document: Document) {
    /**
     * Dynamically inject editor-style.scss file if not injected
     */
    if (!document.getElementById('editor-styles')) {
      /**
       * Get head element. We will use it to append our editor-styles.scss file as a stylesheet.
       */
      const head: HTMLHeadElement = this.document.getElementsByTagName('head')[0];
      /**
       * Create a link element so we can inject our editor-styles.scss
       */
      const linkElement: HTMLLinkElement = this.document.createElement('link');
      linkElement.id = 'editor-styles';
      linkElement.rel = 'stylesheet';
      linkElement.href = 'editor-styles.css';
      head.appendChild(linkElement);
    }
  }

  ngOnInit(): void {
    /**
     * Hide header
     */
    AppComponent.UI_STATUS.emit(DashUiStatus.NONE);
    /**
     * Add keydown listener to Ctrl+S to save
     */
    this.keydownListener = this.renderer2.listen(document, 'keydown.control.s', (event: KeyboardEvent): void => {
      event.preventDefault();
      if (this.loading) {
        return;
      }
      this.autoSave = true;
      this.save();
    });
    // Add keydown listener to Ctrl+/ to open shortcuts modal.
    this.shortcutsModalKeydownListener = this.renderer2.listen(document, 'keydown.control./',
      (event: KeyboardEvent): void => {
        // Prevent shortcuts modal from opening multiple times when it's already opened.
        if (this.isShortcutsModalOpen) {
          return;
        }
        event.preventDefault();
        this.showShortcuts();
      });
    /**
     * Setup entry form
     */
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      excerpt: [''],
      tags: [[]],
      status: [EntryStatus.Draft],
      slug: [''],
      comment_enabled: [true],
      featured: [false],
      is_page: [false],
      start_publication: [null],
      cover_image: [null],
      meta_description: [''],
    });
    this.form.valueChanges.pipe(debounceTime(300)).subscribe((data): void => {
      this.hasUnsavedChanges = !equal(this.oldForm, data);
    });
    /**
     * Set up tag query form
     */
    this.tagQueryControl.valueChanges.pipe(debounceTime(300)).subscribe((value: string): void => {
      /**
       * Value will be null when the user has selected an auto tag.
       * So we don't retrieve tags again until user writes something.
       */
      if (value === null) {
        return;
      }
      /**
       * Retrieve tags based on given keyword.
       */
      this.getTags(value);
    });
    /**
     * Retrieve tags initially so when the user focuses on the input,
     * he/she sees list of tags without writing anything.
     */
    this.getTags();
    /**
     * Make a copy of entry
     */
    this.oldEntry = cloneDeep(this.form.value);
    this.oldForm = cloneDeep(this.form.value);
    /**
     * Subscribe to current state's params changes
     */
    this.activatedRoute.params.subscribe((params: Params): void => {
      if (params.id === 'new' || params.id === 'page') {
        this.form.reset({
          title: '',
          content: '',
          excerpt: '',
          tags: [],
          status: EntryStatus.Draft,
          slug: '',
          comment_enabled: true,
          featured: false,
          is_page: params.id === 'page',
          start_publication: null,
          cover_image: null,
          meta_description: '',
        });
        /**
         * Reset auto save checker.
         */
        clearInterval(this.autoSaveInterval);
        this.isEditing = false;
        this.initAutoSave();
      }
      if (params.id && (params.id !== 'new' && params.id !== 'page')) {
        clearInterval(this.autoSaveInterval);
        this.getEntry(params.id.toString());
      } else {
        this.entryLoaded = true;
      }
      setTimeout((): void => {
        this.updateTitle();
      });
    });
  }

  ngOnDestroy() {
    /**
     * Show header back
     */
    AppComponent.UI_STATUS.emit(DashUiStatus.ALL);
    /**
     * Un-listen function for disposing of keydown listener.
     */
    this.keydownListener();
    this.shortcutsModalKeydownListener();
    /**
     * Clear auto save interval from running after page destroy.
     */
    clearInterval(this.autoSaveInterval);
    /**
     * Auto save entry after the user leaves page by navigation.
     */
    if (!this.loading && !equal(this.form.value, this.oldForm)) {
      this.autoSave = true;
      this.save();
    }
  }

  ngAfterViewInit(): void {
    /**
     * Instantiate a template portal and attach {@link linkEditTemplateRef} as its template reference
     */
    this.linkEditTemplatePortal = new TemplatePortal(this.linkEditTemplateRef, this.viewContainerRef);
    /**
     * Instantiate a template portal and attach {@link linkPreviewTemplateRef} as its template reference
     */
    this.linkPreviewTemplatePortal = new TemplatePortal(this.linkPreviewTemplateRef, this.viewContainerRef);
    /**
     * By default link portal outlet should host nothing
     */
    this.selectedLinkPortalOutlet = null;
  }

  /**
   * Insert divider in editor
   */
  insertDivider(): void {
    const range: RangeStatic = this.editor.getSelection(true);
    // Insert an empty line
    this.editor.insertText(range.index, '\n');
    // Insert divider
    this.editor.insertEmbed(range.index + 1, 'divider', true);
    // Set cursor selection
    this.editor.setSelection(range.index + 2, range.length);
  }

  /**
   * Insert image into editor by opening file selection
   */
  insertImage(): void {
    const range: RangeStatic = this.editor.getSelection();
    /**
     * If user is in the editor
     */
    if (range) {
      this.cursorIndex = range.index + range.length;
    } else {
      this.cursorIndex = 0;
    }
    /**
     * File selection
     */
    this.showFileListModal(true);
    this.showComposeOptions = false;
  }

  /**
   * Format line and hide {@link showComposeOptions compose options} so it won't interrupt the user while writing.
   *
   * @param key Format key
   * @param value Format value
   */
  format(key: string, value: string | number | boolean): void {
    /**
     * Format line or remove the format
     */
    this.editor.format(key, value);
    this.form.get('content').updateValueAndValidity();
    /**
     * Hide compose container and its options
     */
    this.showComposeContainer = false;
    this.showComposeOptions = false;
  }

  /**
   * Format line. This method is used for selection tooltip.
   *
   * @param key Format key
   * @param index Current selection button index
   * @param value Format value
   */
  // formatLine(key: string, index: number, value?: string): void {
  //   const range: Range = this.editor.getSelection();
  //   let formatValue: string | boolean = !this.selectionFormats.hasOwnProperty(key);
  //   if (value && this.selectionFormats[key] !== value) {
  //     formatValue = value;
  //   }
  //   /**
  //    * Format line or remove the format
  //    */
  //   this.editor.formatLine(range.index, range.length, key, formatValue);
  //   this.selectionFormats = this.editor.getFormat(range.index, range.length);
  //   setTimeout((): void => {
  //     this.keyManagerComponentBubble.setActiveItem(index);
  //   });
  // }

  /**
   * Commenting out this section, because it's for bubble selection which is for future features.
   * Format text based selection
   *
   * @param key Format key
   * @param index Current selection button index
   */
  // formatText(key: string, index?: number): void {
  //   const range: Range = this.editor.getSelection();
  //   /**
  //    * Format line or remove the format
  //    */
  //   this.editor.formatText(range.index, range.length, key, !this.selectionFormats.hasOwnProperty(key));
  //   this.selectionFormats = this.editor.getFormat(range.index, range.length);
  //   // setTimeout((): void => {
  //   //   this.keyManagerComponentBubble.setActiveItem(index);
  //   // });
  // }

  /**
   * @returns AbstractControl
   */
  private get tagsControl(): AbstractControl {
    return this.form.get('tags');
  }

  /**
   * Update form controls
   *
   * @param data Entry
   */
  private patchForm(data: Entry): void {
    this.form.patchValue({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags,
      status: data.status,
      slug: data.slug,
      comment_enabled: data.comment_enabled,
      featured: data.featured,
      is_page: data.is_page,
      start_publication: new Date(data.start_publication).toISOString().slice(0, -1),
      cover_image: data.media.cover_image ? data.media.cover_image.id : null,
      meta_description: data.meta_description,
    });
    this.coverImage = data.media.cover_image;
    this.oldForm = cloneDeep(this.form.value);
    this.updateTitle();
  }

  /**
   * On editor creation callback
   *
   * @param editor Quill instance
   */
  onEditorInit(editor: Quill): void {
    const HEADERS: string[] = [
      HeaderKey.PARAGRAPH,
      HeaderKey.H1,
      HeaderKey.H2,
      HeaderKey.H3,
      HeaderKey.H4,
      HeaderKey.H5,
      HeaderKey.H6,
    ];

    /**
     * Iterate through HEADERS and add key binding for each of them.
     * Ctrl+Alt+N
     */
    HEADERS.forEach((key: string): void => {
      /**
       * If value was '0' (which means it's a normal text), then change format value to false.
       */
      let formatValue: boolean | string = key;
      if (key === HeaderKey.PARAGRAPH) {
        formatValue = false;
      }
      /**
       * Add binding to keyboard
       */
      editor.keyboard.addBinding({
        key,
        altKey: true,
        ctrlKey: true,
      } as any, (range: RangeStatic): void => {
        this.format('header', formatValue);
      });
    });
    /**
     * Shift+K
     * Add keyboard shortcut for inserting links.
     */
    editor.keyboard.addBinding({ key: 'K', shortKey: true }, (range: RangeStatic, context): void => {
      this.insertLink();
    });
    /**
     * Disable drag and dropping into the editor
     */
    editor.root.addEventListener('drop', (event: DragEvent): void => {
      event.preventDefault();
    }, false);
    editor.root.addEventListener('mousedown', (event: DragEvent): void => {
      setTimeout(() => {
        this.displayCaret(editor);
      });
    }, false);

    // Editor instance
    this.editor = editor;
    this.editorInit = true;
    this.editor.addContainer(this.sideBarControls.nativeElement);
    // this.editor.addContainer(this.selectionBubble.nativeElement);
    this.editor.addContainer(this.linkBubble.nativeElement);
    this.editor.addContainer(this.caret.nativeElement);

    /**
     * Editor clipboard whitelist
     */
    const whitelist: string[] = [
      'bold',
      'italic',
      'underline',
      'strike',
      'link',
      'blockquote',
      'code-block',
      'code',
      'list',
      'header',
      'direction',
      'align',
      'indent',
      'allow',
      'allowfullscreen',
      'webkitallowfullscreen',
      'mozallowfullscreen',
      'frameborder',
    ];
    /**
     * Insert whitelist
     */
    const insertWhitelist: string[] = ['image', 'video', 'divider', 'embed', 'soundcloud'];
    /**
     * On clipboard element node pasted
     */
    editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node: HTMLElement, delta: DeltaStatic): Delta => {
      const ops: DeltaOperation[] = [];
      delta.ops.forEach((op: DeltaOperation): void => {
        /**
         * Check attributes whitelist
         */
        if (op.attributes) {
          Object.keys(op.attributes).forEach((attr: string): void => {
            if (whitelist.indexOf(attr) === -1) {
              delete op.attributes[attr];
            }
          });
        }
        /**
         * Commenting out this section for future features.
         * Check if pasted element was an image
         */
        // if (op.insert.hasOwnProperty('image') &&
        //   !op.insert['image'].startsWith('https://gonevis-draft.s3.amazonaws.com') &&
        //   !op.insert['image'].startsWith('https://gonevis.s3.amazonaws.com')) {
        //   const range: RangeStatic = this.editor.getSelection(true);
        //   this.writeService.getPastedImage(node.getAttribute('src')).subscribe((data: Blob): void => {
        //     const file: File = new File([data], 'name', { type: data.type });
        //     this.uploadFile(file);
        //   }, (): void => {
        //     this.editor.insertEmbed(range.index, 'image', op.insert['image']);
        //   });
        //   return;
        // }
        /**
         * Check insert whitelist
         */
        if (op.insert && (typeof op.insert === 'string' || typeof op.insert === 'object' &&
          Object.keys(op.insert).some((key: string): boolean => insertWhitelist.includes(key)))) {
          ops.push({
            attributes: op.attributes,
            insert: op.insert,
          });
        }
      });
      delta.ops = ops;
      return delta;
    });
    /**
     * On clipboard text node pasted
     */
    editor.clipboard.addMatcher(Node.TEXT_NODE, (node: Text, delta: DeltaStatic): DeltaStatic => {
      const extractedUrl: string = WriteComponent.extractVideoUrl(node.data);
      if (extractedUrl !== null) {
        delta.ops = [{
          insert: {
            video: extractedUrl,
          },
        }];
      }

      // If pasted string starts with Gist, Twitter or Instagram then URL then start converting it to embed.
      WriteComponent.EMBED_WHITELIST.forEach((host: string): void => {
        if (node.data.startsWith(host)) {
          // Check if embed was from Pastebin.
          if (node.data.startsWith('https://pastebin.com/')) {
            node.data = node.data.replace('pastebin.com/', 'pastebin.com/embed_js/');
          }
          delta.ops = [{
            insert: {
              embed: node.data,
            },
          }];
        }
      });
      /**
       * Insert SoundCloud embed if given link matches SoundCloud URL.
       */
      if (node.data.startsWith('https://soundcloud.com/')) {
        this.writeService.getSoundCloud(node.data).subscribe((data: SoundCloudEmbed): void => {
          // Get current selection
          const range: RangeStatic = editor.getSelection();
          // Insert SoundCloud embed
          editor.insertEmbed(range.index, 'soundcloud', data.html);
          // Set cursor selection after SoundCloud embed
          editor.setSelection({ index: range.index + 2, length: 0 });
        });
        return new Delta();
      }

      return delta;
    });
    this.cursorIndex = 0;
    /**
     * Add handler method for image at toolbar
     */
    editor.getModule('toolbar').addHandler('image', (): void => {
      this.insertImage();
    });
  }

  /**
   * On editor change update compose button position and conditionally toggle its visibility
   *
   * @param event Editor event
   */
  onEditorChange(event: {
    content: any;
    delta: any;
    editor: Quill;
    event: 'text-change';
    html: string | null;
    oldDelta: any;
    source: string;
    text: string;
  } | {
    editor: Quill;
    event: 'selection-change';
    oldRange: Range | null;
    range: Range | null;
    source: string;
  }): void {
    this.hideCaret();
    /**
     * Display caret
     */
    setTimeout(() => {
      this.displayCaret(event.editor);
    });

    if (event.event !== 'selection-change') {
      this.displayComposeOptions(event.editor, event.editor.getSelection(true));
      // this.displaySelectionBubble(event.editor);
      return;
    }
    /**
     * Hide compose container and its options
     */
    this.showComposeContainer = false;
    this.showComposeOptions = false;
    this.changeDetectorRef.detectChanges();
    if (event.range == null) {
      this.hideCaret();
      // this.hideSelectionBubble();
      return;
    }
    /**
     * Update current selection's format
     */
    this.selectionFormats = event.editor.getFormat(event.range);
    if (event.range.length === 0) {
      // this.hideSelectionBubble();
      /**
       * Get current block
       */
      const [block, blockOffset]: [BlockBlot, number] = (event.editor.scroll as any)
        .descendant(Block, event.range.index);
      /**
       * @todo Fix this method later by top offset of current selection.
       * Handle space for scrolling
       */
      if ((event.editor as any).scrollingContainer && block && block.domNode.tagName !== 'PRE') {
        /**
         * Get editor scrolling container's bounding rect
         */
        const boundingClientRect: DOMRect = (event.editor as any).scrollingContainer.getBoundingClientRect();
        /**
         * Get current block's bounding rect
         */
        const blockRect = block.domNode.getBoundingClientRect();
        /**
         * Update scroll top position
         */
        if (blockRect.top < boundingClientRect.top) {
          (event.editor as any).scrollingContainer.scrollTop -= 40;
        }
        if (blockRect.bottom > boundingClientRect.bottom) {
          (event.editor as any).scrollingContainer.scrollTop += 40;
        }
      }
      this.displayComposeOptions(event.editor, event.range);
      /**
       * Get inline blot based on current range's index.
       */
      const [inline, inlineOffset]: [InlineBlot, number] = (event.editor.scroll as any)
        .descendant(Inline, event.range.index);
      /**
       * If inline blot was an anchor element then proceed to show preview bubble.
       */
      if (inline !== null && inline.domNode.tagName === 'A') {
        /**
         * Get current {@link linkPreviewTemplatePortal} context
         */
        const previewContext = this.linkPreviewTemplatePortal.context;
        /**
         * If not same link then re-instantiate
         */
        if (previewContext && previewContext.$implicit
          && !inline.domNode.isEqualNode(previewContext.$implicit.blot.domNode)) {
          this.hideLinkBubble();
          setTimeout((): void => {
            this.displayLinkPreview(event.range, inline);
          });
        } else {
          this.displayLinkPreview(event.range, inline);
        }
      } else {
        this.hideLinkBubble();
        // this.showSelectionBubble = false;
      }
    } else {
      this.showComposeContainer = false;
      setTimeout((): void => {
        this.hideCaret();
      });
      this.hideLinkBubble();
      // this.displaySelectionBubble(event.editor);
    }
  }

  /**
   * Display plus button next to an empty P element.
   *
   * @param editor Editor which is required to get bounds.
   * @param range Selection range required to get the position of the current P element.
   */
  displayComposeOptions(editor: Quill, range: RangeStatic): void {
    /**
     * In case if range was undefined then break the code.
     */
    if (!range) {
      return;
    }
    /**
     * Get current block
     */
    const [block, blockOffset]: [BlockBlot, number] = (editor.scroll as any)
      .descendant(Block, range.index);
    /**
     * Move compose container next to current focused element if element was an empty 'P'.
     */
    if (block != null && block.domNode.tagName === 'P' && block.domNode.firstChild instanceof HTMLBRElement) {
      this.showComposeContainer = true;
      /**
       * Relocate compose component
       */
      const rangeBounds: BoundsStatic = editor.getBounds(range.index, range.length);
      this.renderer2.setStyle(this.sideBarControls.nativeElement, 'top', `${block.domNode.offsetTop - (36 / 6)}px`);
      if (this.selectionFormats.align === 'right') {
        /**
         * Direction RTL in which the selection for compose buttons can be moved
         */
        this.keyManagerComponent.withHorizontalOrientation('rtl');
        this.renderer2.addClass(this.sideBarControls.nativeElement, 'ltr');
      } else {
        /**
         * Direction LTR in which the selection for compose buttons can be moved
         */
        this.keyManagerComponent.withHorizontalOrientation('ltr');
        this.renderer2.removeClass(this.sideBarControls.nativeElement, 'ltr');
      }
      this.renderer2.setStyle(this.sideBarControls.nativeElement, 'left', `${rangeBounds.left}px`);
    } else {
      this.showComposeContainer = false;
      // this.hideSelectionBubble();
    }
  }

  /**
   * Position a bubble on current caret position
   *
   * @param element Element to position
   * @param range Range
   */
  setBubblePosition(element: HTMLElement, range: RangeStatic): void {
    // Prevent code from running if the editor is not yet initialized or given range is invalid.
    if (!range || !this.editor) {
      return;
    }
    const rangeBounds: BoundsStatic = this.editor.getBounds(range.index, range.length);
    setTimeout((): void => {
      /**
       * Get bounds left
       */
      let left: number = rangeBounds.left + rangeBounds.width / 2 - element.offsetWidth / 2;
      /**
       * Get bounds right
       */
      const right: number = (rangeBounds.left + rangeBounds.width / 2) + element.offsetWidth / 2;
      /**
       * If bounds left is more than container's left then prevent from going any further
       *
       * Else if right bounds is more than container's right then prevent from going any further
       */
      if (left < 105) {
        left = rangeBounds.left;
      } else if (right >= this.editor.root.offsetWidth - 105) {
        left = rangeBounds.left + rangeBounds.width - element.offsetWidth;
      }
      /**
       * Set give element's top & left style
       */
      this.renderer2.setStyle(element, 'left', `${left}px`);
      this.renderer2.setStyle(element, 'top', `${rangeBounds.bottom + 10}px`);
      this.changeDetectorRef.detectChanges();
    });
  }

  /**
   * Hide link modes
   */
  private hideLinkBubble(): void {
    this.selectedLinkPortalOutlet = null;
    this.showLinkBubble = false;
    this.renderer2.setStyle(this.linkBubble.nativeElement, 'left', 'unset');
    this.renderer2.setStyle(this.linkBubble.nativeElement, 'top', `unset`);
  }

  /**
   * Commenting out selection bubble behavior and keeping it for future features.
   * Display selection bubble based on current rage selection
   *
   * @param editor Editor
   *
   * @see selectionBubble
   */
  // private displaySelectionBubble(editor: Quill): void {
  //   /**
  //    * Get current range selection
  //    */
  //   const range: RangeStatic = editor.getSelection();
  //   /**
  //    * If range doesn't exist, it means editor was just initialled.
  //    */
  //   if (!range) {
  //     return;
  //   }
  //   /**
  //    * Update selection format
  //    */
  //   this.selectionFormats = editor.getFormat(range);
  //   /**
  //    * If current range doesn't have selection, then break the code.
  //    */
  //   if (!range.length) {
  //     return;
  //   }
  //   /**
  //    * Hide caret
  //    */
  //   this.hideCaret();
  //   /**
  //    * If selected text was an empty space, break the code.
  //    */
  //   if (editor.getText(range.index, range.length).trim() === '') {
  //     return;
  //   }
  //   /**
  //    * Hide compose container
  //    */
  //   this.showComposeContainer = false;
  //   /**
  //    * Hide link bubble
  //    */
  //   this.showLinkBubble = false;
  //   /**
  //    * Show selection bubble
  //    */
  //   this.showSelectionBubble = true;
  //   /**
  //    * Checks this view and its children
  //    */
  //   this.changeDetectorRef.detectChanges();
  //   /**
  //    * Get bounds based on given range index and length
  //    *
  //    * @see BoundsStatic
  //    * @see Quill.getBounds
  //    */
  //   const rangeBounds: BoundsStatic = editor.getBounds(range.index, range.length);
  //   /**
  //    * Get bounds left
  //    */
  //   let left: number = rangeBounds.left + rangeBounds.width / 2 - this.selectionBubble.nativeElement.offsetWidth / 2;
  //   /**
  //    * Get bounds right
  //    */
  //   const right: number = (rangeBounds.left + rangeBounds.width / 2) +
  //     this.selectionBubble.nativeElement.offsetWidth / 2;
  //   /**
  //    * If bounds left is more than container's left then prevent from going any further
  //    *
  //    * Else if right bounds is more than container's rigt then prevent from going any further
  //    */
  //   if (left < 105) {
  //     left = rangeBounds.left;
  //   } else if (right >= editor.root.offsetWidth - 105) {
  //     left = rangeBounds.left + rangeBounds.width - this.selectionBubble.nativeElement.offsetWidth;
  //   }
  //   /**
  //    * Set {@link selectionBubble} left style property to match bounds {@see left}
  //    */
  //   this.renderer2.setStyle(this.selectionBubble.nativeElement, 'left', `${left}px`);
  //   /**
  //    * Set {@link selectionBubble} top style property to match bounds bottom
  //    */
  //   this.renderer2.setStyle(this.selectionBubble.nativeElement, 'top', `${rangeBounds.bottom + 10}px`);
  // }

  /**
   * Commenting out selection bubble behavior and keeping it for future features.
   * Hide selection tooltip and reset left and top
   */
  // private hideSelectionBubble(): void {
  //   this.showSelectionBubble = false;
  //   this.renderer2.setStyle(this.selectionBubble.nativeElement, 'left', 'unset');
  //   this.renderer2.setStyle(this.selectionBubble.nativeElement, 'top', `unset`);
  // }

  /**
   * Hide caret
   */
  private hideCaret(): void {
    this.showCaret = false;
    this.renderer2.setStyle(this.caret.nativeElement, 'opacity', '0');
    this.renderer2.setStyle(this.caret.nativeElement, 'height', '0');
  }

  /**
   * Display {@link caret} element on current built-in caret position
   *
   * @param editor Editor
   */
  private displayCaret(editor: Quill): void {
    /**
     * Get current range selection
     */
    const range: RangeStatic = editor.getSelection();
    /**
     * If range doesn't exist, it means editor was just initialled.
     */
    if (!range) {
      return;
    }
    /**
     * Update current selection's format
     */
    this.selectionFormats = editor.getFormat(range);
    if (this.selectionFormats.direction === 'rtl') {
      editor.root.style.caretColor = 'black';
      if (this.showCaret) {
        this.hideCaret();
      }
      return;
    } else {
      editor.root.style.caretColor = 'transparent';
    }
    /**
     * Get bounds based on given range index and length
     *
     * @see BoundsStatic
     * @see Quill.getBounds
     */
    const rangeBounds: BoundsStatic = editor.getBounds(range.index, range.length);
    /**
     * Calculate current text's height by subtracting {@link rangeBounds} bottom and top
     */
    const height: number = rangeBounds.bottom - rangeBounds.top;
    /**
     * Calculate current text's position from top by subtracting {@link rangeBounds} bottom and height divided by 2
     * and {@link height} divided by 2.
     */
    const top: number = rangeBounds.bottom - rangeBounds.height / 2 - height / 2;
    /**
     * Set {@link caret} left style property to match {@link rangeBounds} left
     */
    this.renderer2.setStyle(this.caret.nativeElement, 'left', `${rangeBounds.left}px`);
    /**
     * Set {@link caret} top style property to match the calculated {@link top}
     */
    this.renderer2.setStyle(this.caret.nativeElement, 'top', `${top}px`);
    /**
     * Set {@link caret} height style property to match the calculated {@link height}
     */
    this.renderer2.setStyle(this.caret.nativeElement, 'height', `${height}px`);
    /**
     * Set {@link caret} opacity style property to 1 so it can appear instantly
     */
    this.renderer2.setStyle(this.caret.nativeElement, 'opacity', `1`);
    this.showCaret = true;
  }

  /**
   * Get entry
   *
   * @param id Entry ID
   */
  getEntry(id: string): void {
    this.isEditing = true;
    this.loading = true;
    this.id = id;
    this.writeService.getEntry(id).subscribe((data: Entry): void => {
      this.loading = false;
      this.entryLoaded = true;
      this.oldEntry = cloneDeep(data);
      const tags = data.tags;
      if (data.entrydraft) {
        this.postChanged = true;
        data = data.entrydraft;
        this.translateService.get(['LOADING_DRAFT', 'UNPUBLISHED_CHANGES']).subscribe((response: Params): void => {
          this.toast.warning(response.UNPUBLISHED_CHANGES as string, response.LOADING_DRAFT as string);
        });
      }
      data.tags = tags;
      /**
       * Don't patch if user was creating post
       */
      if (!this.wasCreating) {
        this.patchForm(data);
      }
      if (this.editor) {
        (this.editor as any).history.clear();
      }
      // Initial auto-save
      this.initAutoSave();
    });
  }

  /**
   * @param event Keyboard event to be used for determining which key has been pressed to hide compose buttons
   */
  onBlackListKeydown(event: KeyboardEvent): void {
    this.editor.focus();
    /**
     * Hide compose options on Escape pressed
     */
    if (event.code === 'Escape') {
      this.showComposeOptions = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Update entry and navigate back to posts/pages
   */
  goBack(): void {
    let rootPage: string;
    if (this.oldEntry.is_page) {
      rootPage = 'pages';
    } else {
      rootPage = 'posts';
    }
    if (!equal(this.form.value, this.oldForm)) {
      this.autoSave = true;
      this.save();
    }
    this.router.navigate(['../', rootPage], {
      relativeTo: this.activatedRoute.parent,
    });
  }

  /**
   * Update entry
   *
   * @param payload Payload required by backend
   * @param status Status of entry
   */
  updateEntry(payload: Params, status?: EntryStatus): void {
    this.loading = true;
    this.writeService.updateEntry(payload).subscribe((data: Entry): void => {
      if (!this.autoSave) {
        this.oldEntry = cloneDeep(data);
        this.postChanged = false;
        const tags = data.tags;
        if (data.entrydraft) {
          data = data.entrydraft;
        }
        data.tags = tags;
        this.patchForm(data);
      } else {
        this.postChanged = true;
        this.autoSave = false;
        this.oldForm = cloneDeep(this.form.value);
        this.hasUnsavedChanges = false;
      }
      this.loading = false;
    }, (): void => {
      this.loading = false;
    });
  }

  /**
   * Save entry
   *
   * @param status Status of entry
   */
  save(status?: EntryStatus): void {
    // Setup payload and required fields.
    const payload: Params = Object.assign({}, this.form.value);
    payload.content = this.editor.root.innerHTML;
    payload.id = this.id;
    payload.site = BlogService.currentBlog.id;
    // Set status property only if it was given. Status is given only when user is changing entry's status directly.
    if (status !== null) {
      payload.status = status;
    }
    /**
     * Prevent backend from raising error on empty string.
     */
    if (payload.start_publication === '') {
      payload.start_publication = null;
    }
    // If method was called with auto save in progress,
    // then remove `status` property from payload to save the changes in draft. Basically not sending status to endpoint
    // will cause the changes to be saved as draft.
    if (this.autoSave || status === null) {
      delete payload.status;
    }
    if (this.isEditing) {
      this.updateEntry(payload, status);
    } else {
      this.addEntry(payload, status);
    }
  }


  /**
   * Set entry's status based on given param's value and prompt a confirm alert before updating.
   *
   * @param status Entry status to update to.
   */
  setStatus(status: EntryStatus): void {
    // It's being used to display confirm message based on given entry status from param.
    let confirmMessage: 'PUBLISH_ENTRY_CONFIRM' | 'DRAFT_ENTRY_CONFIRM';
    if (status === EntryStatus.Draft) {
      confirmMessage = 'DRAFT_ENTRY_CONFIRM';
    } else {
      confirmMessage = 'PUBLISH_ENTRY_CONFIRM';
    }
    // Prompt a native confirm alert to ask the user to change status.
    if (!confirm(this.translateService.instant(confirmMessage))) {
      return;
    }
    this.save(status);
  }

  /**
   * Add Entry
   *
   * @param payload Payload required by backend
   * @param status Status of entry
   */
  addEntry(payload: Params, status?: EntryStatus): void {
    if (this.form.get('title').value.trim() === '') {
      this.form.get('title').setValue(`Untitled ${new Date().toDateString()}`);
    }
    this.writeService.addEntry(this.form.value).subscribe((data: Entry): void => {
      this.loading = false;
      if (this.autoSave) {
        this.wasCreating = true;
      }
      this.router.navigate(['../', data.id], { relativeTo: this.activatedRoute });
    }, (): void => {
      this.loading = false;
    });
  }

  /**
   * Move entry to trash without any prompt
   */
  moveToTrash(): void {
    this.loading = true;
    this.writeService.updateEntry({
      id: this.id,
      is_direct_save: true,
      status: EntryStatus.Trash,
    }).subscribe((): void => {
      this.loading = false;
      /**
       * Raise a toaster to let user know which entry has just been moved to trash.
       */
      this.translateService.get('MOVED_TO_TRASH').subscribe((response: string): void => {
        this.toast.success(response, this.oldEntry.title);
      });
      /**
       * Redirect to posts or pages route based on current entry type
       */
      this.router.navigate(['../../', this.oldEntry.is_page ? 'pages' : 'posts'], {
        relativeTo: this.activatedRoute,
      });
    }, (): void => {
      this.loading = false;
      /**
       * Raise a toaster to let user know about the failure.
       */
      this.translateService.get('ERROR_MOVING_TO_TRASH').subscribe((response: string): void => {
        this.toast.error(response);
      });
    });
  }

  /**
   * Revert entry changes from draft to last published changes.
   */
  revertChanges(): void {
    if (confirm(this.translateService.instant('DISCARD_CHANGES_PROMPT')) === false) {
      return;
    }
    this.patchForm(this.oldEntry);
    this.oldEntry.entrydraft = null;
    this.save();
  }

  /**
   * Get tags
   *
   * @param search Search text
   */
  getTags(search: string = ''): void {
    this.writeService.getTags(search).subscribe((data: ApiResponse<Tag>): void => {
      this.tags = data.results.filter((tag: Tag): boolean => !this.tagsControl.value.includes(tag.slug));
    });
  }

  /**
   * Add tag
   *
   * @param slug Tag slugs
   */
  addTag(slug: string): void {
    /**
     * Clear {@link tagQueryControl}'s value so user can search another tag
     */
    this.tagQueryControl.setValue(null);
    this.tags = [];
    const tags: string[] = this.tagsControl.value;
    this.tagsControl.setValue([...tags, ...[slug]]);
  }

  /**
   * Remove tag from entry
   *
   * @param slug Tag slug
   */
  removeTag(slug: string): void {
    const newValue: string[] = this.tagsControl.value.filter((tagSlug: string): boolean => tagSlug !== slug);
    this.tagsControl.setValue(newValue);
  }

  /**
   * Show file selection modal
   *
   * @param isEditorImage Determines whether selecting image for editor or not
   */
  showFileListModal(isEditorImage: boolean): void {
    let selected: string = null;
    if (!isEditorImage && this.form.get('cover_image').value) {
      selected = this.form.get('cover_image').value;
    }
    this.fileListModalRef = this.modalService.show(FileSelectionComponent, {
      class: 'modal-lg',
      initialState: {
        selected,
      },
    });
    /**
     * On file selected, determine whether the given request was for entry's cover image or for editor image.
     */
    this.fileListModalRef.content.choose.subscribe((file: FileMedia): void => {
      if (isEditorImage) {
        this.editor.insertEmbed(this.cursorIndex, 'image', file.file);
        this.editor.setSelection({ index: this.cursorIndex + 1, length: 0 });
        this.form.get('content').updateValueAndValidity();
      } else {
        this.form.get('cover_image').setValue(file.id);
        this.coverImage = file;
      }
    });
  }

  /**
   * Check if "ENTER" is pressed and focus on editor conditionally.
   */
  preventBreak(): false {
    // Get first line of the editor.
    const firstLine: [BlockBlot, number] = this.editor.getLine(0);
    // If first line is empty and it has no children, then move selection to it,
    // otherwise create an empty line and set the selection to it.
    if (firstLine[0] && firstLine[0].domNode && firstLine[0].domNode.firstChild instanceof HTMLBRElement) {
      this.editor.setSelection(0, 0, 'silent');
    } else {
      this.editor.insertText(0, '\n', {}, 'user');
      this.editor.setSelection(0, 0, 'silent');
    }
    // Prevent ENTER event so textarea won't have break line in it.
    return false;
  }

  /**
   * On title arrow key pressed, restore previous selection on editor and focus on it.
   */
  onTitleArrowDown(): false {
    this.editor.getSelection(true);
    // Prevent keyboard event so the default behavior of keyboard doesn't apply.
    return false;
  }

  /**
   * Set window title to post title
   */
  updateTitle(): void {
    const titleValue: string = this.form.get('title').value ? this.form.get('title').value : 'Untitled';
    /**
     * Set window title
     */
    this.title.setTitle(`${titleValue}${AppComponent.TITLE_SUFFIX}`);
  }

  /**
   * Remove current selection's format based on current selection's range
   *
   * @param range Current selection's range
   */
  private removeFormatting(range: RangeStatic): void {
    /**
     * Stores list of blots based on current selection range
     */
    let leaves: Blot[] = [];
    /**
     * Get leaves based on current selection range
     */
    leaves = (this.editor.scroll as any).descendants(QuillParchment.Leaf, range.index, range.length);
    /**
     * A local variable to prevent duplicate formats
     */
    const FORMATS: { [key: string]: any; } = {};
    /**
     * Iterate into {@see leaves} and clear their format
     */
    leaves
      .filter((blot: Blot): boolean => blot !== null)
      .forEach((blot: Blot): void => {
        /**
         * Get blot's format
         */
        const BLOT_FORMATS: { [key: string]: any; } = bubbleFormats(blot);
        /**
         * Iterate into {@see BLOT_FORMATS} keys and strip duplicates and finally clear blot's format
         */
        Object.keys(BLOT_FORMATS).forEach((key: string): void => {
          /**
           * Prevent duplicate
           */
          if (FORMATS.hasOwnProperty(key) && FORMATS[key] === BLOT_FORMATS[key]) {
            return;
          }
          /**
           * Update {@see FORMATS} so that next time we can check for duplcates
           */
          FORMATS[key] = BLOT_FORMATS[key];
          /**
           * Remove format
           */
          this.editor.format(key, false);
        });
      });
  }

  /**
   * View entry on blog
   */
  viewOnBlog(): void {
    let entryUrl: string = this.oldEntry.absolute_uri;
    /**
     * If entry's status is set to Draft, then add `?view=preview` query param to the end of
     * the entry's {@see entryUrl URL}, otherwise if status is set to Published,
     * then simply redirect user to entry's URL.
     */
    if (this.oldEntry.status === EntryStatus.Draft) {
      entryUrl = `${this.oldEntry.absolute_uri}?view=preview`;
    }
    window.open(entryUrl, '_blank');
  }

  /**
   * Insert link. This is being used for selection tooltip.
   */
  insertLink(): void {
    /**
     * Get range
     */
    const range: Range = this.editor.getSelection(true);
    const [inline, inlineOffset] = (this.editor as any).scroll.descendant(QuillParchment.Inline, range.index);
    /**
     * Remove link format if selected text is already a link
     */
    if (this.selectionFormats.hasOwnProperty('link') && inline !== null && inline.domNode.tagName === 'A') {
      this.changeDetectorRef.detectChanges();
      this.setBubblePosition(this.linkBubble.nativeElement, range);
      this.editLink({
        text: inline.domNode.innerText,
        link: inline.domNode.getAttribute('href'),
        blot: inline,
        multiLine: false,
      });
      return;
    }
    /**
     * Get selected text
     */
    let preview: string = this.editor.getText(range.index, range.length);
    /**
     * Check for mailto:
     */
    if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
      preview = 'mailto:' + preview;
    }
    /**
     * Edit text for link
     */
    this.displayLinkInsert(this.editor.getSelection(), preview, preview);
  }

  /**
   * Edit link
   */
  editLink(context): void {
    this.showLinkBubble = true;
    this.linkEditTemplatePortal.context = {
      $implicit: context,
    };
    this.selectedLinkPortalOutlet = this.linkEditTemplatePortal;
    this.changeDetectorRef.detectChanges();
    this.linkUrlInput.nativeElement.select();
  }

  /**
   * Apply link changes
   *
   * @param text Link text
   * @param link Link URL address
   */
  applyLinkChanges(text: string, link: string): void {
    /**
     * Get link {@link Blot} from {@link linkEditTemplatePortal} context
     */
    const context: any = this.linkEditTemplatePortal.context.$implicit;
    const linkBlot = context.blot;
    const multiLine: boolean = context.multiLine;
    if (context.isEmbed) {
      /**
       * Get current range
       */
      const range: RangeStatic = this.editor.getSelection(true);
      /**
       * Instantiate a new Delta with current retain index
       */
      const delta: DeltaStatic = new Delta().retain(range.index);
      /**
       * Check if it's a valid YouTube/Vimeo URL
       */
      const extractedUrl: string = WriteComponent.extractVideoUrl(link);
      if (extractedUrl !== null) {
        delta.insert({ video: extractedUrl });
      }
      /**
       * Check if embed
       */
      WriteComponent.EMBED_WHITELIST.forEach((host: string): void => {
        if (link.startsWith(host)) {
          // Check if embed was from Pastebin.
          if (link.startsWith('https://pastebin.com/')) {
            link = link.replace('pastebin.com/', 'pastebin.com/embed_js/');
          }
          delta.insert({
            embed: link,
          });
        }
      });
      /**
       * Insert SoundCloud embed if given link matches SoundCloud URL.
       */
      if (link.startsWith('https://soundcloud.com/')) {
        this.writeService.getSoundCloud(link).subscribe((data: SoundCloudEmbed): void => {
          // Insert SoundCloud embed
          this.editor.insertEmbed(range.index, 'soundcloud', data.html);
          // Set cursor selection after SoundCloud embed
          this.editor.setSelection({ index: range.index + 2, length: 0 });
        });
        return;
      }
      this.editor.updateContents(delta, 'user');
      this.editor.setSelection({ index: range.index + 2, length: 0 });
      return;
    }
    if (!linkBlot) {
      /**
       * Get current selection
       */
      const range: RangeStatic = this.editor.getSelection(true);
      if (multiLine) {
        this.editor.format('link', link);
        this.editor.setSelection({ index: range.index + range.length, length: 0 });
      } else {
        /**
         * Insert link if no selection
         */
        if (!range.length) {
          this.editor.insertText(range.index, text.trim() || link, { link });
        } else {
          if (text === this.editor.getText(range.index, range.length)) {
            this.editor.format('link', link);
          } else {
            this.editor.deleteText(range.index, range.length);
            this.editor.insertText(range.index, text, { link });
          }
        }
      }
    } else {
      let index: number = linkBlot.offset(this.editor.scroll) + linkBlot.length();
      if (link.trim() !== '') {
        linkBlot.format('link', link);
        if (text !== linkBlot.domNode.innerText) {
          linkBlot.domNode.innerText = text || link;
        }
      } else {
        linkBlot.format('link', false);
      }
      setTimeout((): void => {
        if (link.trim() !== '') {
          index = linkBlot.offset(this.editor.scroll) + linkBlot.length();
        }
        this.editor.setSelection({ index, length: 0 });
      });
    }
    this.hideLinkBubble();
  }

  /**
   * Remove link
   */
  removeLink(): void {
    const blot = this.linkPreviewTemplatePortal.context.$implicit.blot;
    const endIndex: number = blot.offset(this.editor.scroll) + blot.length();
    blot.unwrap();
    setTimeout((): void => {
      this.editor.setSelection(endIndex, 0);
    });
  }

  /**
   * Cancel link edit/insert changes
   */
  cancelLink(): void {
    this.selectedLinkPortalOutlet = null;
    this.editor.getSelection(true);
  }

  /**
   * Display link preview template and calculate its container position
   *
   * @param range Range static
   * @param inline LinkBlot
   */
  displayLinkPreview(range: RangeStatic, inline?: any): void {
    if (inline) {
      /**
       * Contextual data to be passed in to the embedded view which in our case
       * the contextual data will be current link's text and link and our embedded view
       * will be {@link linkPreviewTemplateRef}
       */
      this.linkPreviewTemplatePortal.context = {
        $implicit: {
          text: inline.domNode.innerText,
          link: inline.domNode.getAttribute('href'),
          blot: inline,
          multiLine: false,
        },
      };
      /**
       * Set selected portal to preview mode
       */
      this.selectedLinkPortalOutlet = this.linkPreviewTemplatePortal;
    }
    /**
     * If needed range was not given then break the code to prevent editor from raising erros.
     */
    if (!range) {
      return;
    }
    this.showLinkBubble = true;
    this.setBubblePosition(this.linkBubble.nativeElement, range);
  }

  /**
   * Display link preview template and calculate its container position
   *
   * @param range Range static
   * @param text Link text
   * @param link Link URL address
   * @param isEmbed Whether the link is going to be used for embed
   */
  displayLinkInsert(range: RangeStatic, text: string, link: string, isEmbed: boolean = false): void {
    const multiLine: boolean = (this.editor as any).scroll.lines(range.index, range.length).length > 1;
    if (multiLine) {
      link = '';
    }
    /**
     * Contextual data to be passed in to the embedded view which in our case
     * the contextual data will be current link's text and link and our embedded view
     * will be {@link linkPreviewTemplateRef}
     */
    this.linkEditTemplatePortal.context = {
      $implicit: {
        text,
        link,
        blot: null,
        multiLine,
        isEmbed,
        isInserting: true,
      },
    };

    /**
     * Set selected portal to preview mode
     */
    this.selectedLinkPortalOutlet = this.linkEditTemplatePortal;
    this.showLinkBubble = true;
    this.setBubblePosition(this.linkBubble.nativeElement, range);
    this.changeDetectorRef.detectChanges();
    this.linkUrlInput.nativeElement.select();
  }

  /**
   * Open shortcuts modal
   */
  showShortcuts(): void {
    this.isShortcutsModalOpen = true;
    const modalRef: BsModalRef = this.modalService.show(ShortcutsComponent, { class: 'editor-modal' });
    // On modal closed update variable so 'Ctrl+/' can work.
    modalRef.content.modalClosed.subscribe((): void => {
      this.isShortcutsModalOpen = false;
    });
  }

  private makeCodeBlockHandler(indent: boolean): any {
    return {
      key: TAB,
      shiftKey: !indent,
      format: { 'code-block': true },
      handler: (range: RangeStatic): void => {
        /**
         * Get code block based on given current range
         */
        if (range.length || !indent) {
          let block: any = null;
          let offset: number;
          /**
           * Get code block class from Parchment
           */
          const CodeBlock: any = QuillParchment.query('code-block');
          let index = range.index;
          let length = range.length;
          [block, offset] = (this.editor as any).scroll.descendant(CodeBlock, index);
          /**
           * Break code just in case if code block didn't exist at current selection's index
           */
          if (block == null) {
            return;
          }
          /**
           * Get start and end of the selection
           */
          const start: number = block.newlineIndex(offset, true) + 1;
          const end: number = block.newlineIndex(offset + length);
          /**
           * Get selected lines based on {@link start} & {@link end} of the selection
           */
          const lines: string[] = block.domNode.textContent.slice(start, end).split('\n');
          offset = 0;
          /**
           * Indent lines
           */
          lines.forEach((line: string, lineIndex: number): void => {
            if (indent) {
              block.insertAt(start + offset, CodeBlock.TAB);
              offset += CodeBlock.TAB.length;
              /**
               * If the line is at the start of the selection
               */
              if (lineIndex === 0) {
                /**
                 * Update selection's index to update selection later
                 */
                index += CodeBlock.TAB.length;
              } else {
                /**
                 * Update selection's length to update selection later
                 */
                length += CodeBlock.TAB.length;
              }
            } else if (line.startsWith(CodeBlock.TAB)) {
              block.deleteAt(start + offset, CodeBlock.TAB.length);
              offset -= CodeBlock.TAB.length;
              /**
               * If the line is at the start of the selection
               */
              if (lineIndex === 0) {
                /**
                 * Update selection's index to update selection later
                 */
                index -= CodeBlock.TAB.length;
              } else {
                /**
                 * Update selection's length to update selection later
                 */
                length -= CodeBlock.TAB.length;
              }
            }
            offset += line.length + 1;
          });
          /**
           * Update selection with newly index and length information
           */
          this.editor.update('user');
          this.editor.setSelection(index, length, 'silent');
        } else {
          this.defaultTabHandler(range);
        }
      },
    };
  }

  /**
   * Default tab behavior that is also being used for code-block
   *
   * @param range Selection range
   */
  private defaultTabHandler(range: RangeStatic): void {
    (this.editor as any).history.cutoff();
    const delta: DeltaStatic = new Delta().retain(range.index)
      .delete(range.length)
      .insert('\t');
    this.editor.updateContents(delta, 'user');
    (this.editor as any).history.cutoff();
    this.editor.setSelection(range.index + 1, 0, 'silent');
  }
}
