import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  Renderer2,
  OnDestroy,
  TemplateRef,
  ViewChild,
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
import '@app/components/dash/write/modules/clipboard.ts';
import '@app/components/dash/write/themes/bootstrap.ts';
import { WriteService } from '@app/components/dash/write/write.service';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { ApiResponse } from '@app/interfaces/api-response';
import { File as FileMedia } from '@app/interfaces/file';
import { Params } from '@app/interfaces/params';
import { SoundCloudEmbed } from '@app/interfaces/sound-cloud-embed';
import { Entry } from '@app/interfaces/v1/entry';
import { Tag } from '@app/interfaces/v1/tag';
import { UploadUrlResponse } from '@app/interfaces/v1/upload-url-response';
import { BlogService } from '@app/services/blog/blog.service';
import { FileSelectionComponent } from '@app/shared/file-selection/file-selection.component';
import { environment } from '@environments/environment';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons/faNewspaper';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { TranslateService } from '@ngx-translate/core';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { QuillModules } from 'ngx-quill';
import { ToastrService } from 'ngx-toastr';
import { Quill, RangeStatic } from 'quill';
import Delta from 'quill-delta';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss'],
})
export class WriteComponent implements OnInit, OnDestroy {

  /**
   * Pasted video embed URL
   */
  private static pastedVideoEmbed: string;

  readonly eye: IconDefinition = faEye;
  readonly cog: IconDefinition = faCog;
  readonly times: IconDefinition = faTimes;
  readonly newspaper: IconDefinition = faNewspaper;
  readonly angleDown: IconDefinition = faAngleDown;
  readonly hashtag: IconDefinition = faHashtag;
  readonly image: IconDefinition = faImage;
  readonly plus: IconDefinition = faPlus;
  readonly undo: IconDefinition = faUndo;
  readonly check: IconDefinition = faCheck;
  readonly faTrash: IconDefinition = faTrash;

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

  /**
   * Determines whether selecting image for editor or not
   */
  private isEditorImage: boolean;

  /**
   * Entry status
   */
  readonly entryStatus = EntryStatus;

  @ViewChild('fileListModalTemplate') private fileListModalTemplate: TemplateRef<any>;

  /**
   * Determines whether user was creating post or not
   */
  private wasCreating: boolean;

  /**
   * Old entry
   */
  oldEntry: Entry;

  /**
   * Determines whether to show or hide sidebar
   */
  hideSidebar = true;

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
   * It's being used for attaching minimum date for start publication date
   */
  minDate: Date = new Date();

  /**
   * Quill modules
   */
  options: QuillModules = {
    markdownShortcuts: {},
    toolbar: {
      container: '.toolbar',
      handlers: {
        divider: (): void => {
          const range: RangeStatic = this.editor.getSelection(true);
          // Insert an empty line
          this.editor.insertText(range.index, '\n');
          // Insert divider
          this.editor.insertEmbed(range.index + 1, 'divider', true);
          // Set cursor selection
          this.editor.setSelection(range.index + 2, range.length);
        },
      },
    },
  };

  /**
   * Entry form
   */
  form: FormGroup;

  /**
   * Entry's cover image
   */
  coverImage: FileMedia;

  /**
   * Validate YouTube url
   *
   * @param clipboard Copied text
   */
  private static validatePastedVideo(clipboard: string): boolean {
    let isValid = false;
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
    this.pastedVideoEmbed = null;
    if (youTubeRegExp.test(clipboard)) {
      WriteComponent.pastedVideoEmbed = `https://www.youtube.com/embed/${RegExp.$7}?autoplay=0`;
      isValid = true;
    } else if (vimeoRegExp.test(clipboard)) {
      WriteComponent.pastedVideoEmbed = `https://player.vimeo.com/video/${RegExp.$1}`;
      isValid = true;
    }

    return isValid;
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
        },
      );
    }
  }

  constructor(private elementRef: ElementRef,
              private rd: Renderer2,
              private title: Title,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private translateService: TranslateService,
              private mediaService: MediaService,
              private writeService: WriteService,
              private toast: ToastrService) {
    this.writeService.lazyLoadQuill().subscribe((): void => null);
  }

  ngOnInit(): void {
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
    /**
     * Set up tag query form
     */
    this.tagQueryControl.valueChanges.pipe(debounceTime(300)).subscribe((value: string): void => {
      this.getTags(value);
    });
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
        clearInterval(this.autoSaveInterval);
        this.isEditing = false;
        this.initAutoSave();
      }
      if (params.id && (params.id !== 'new' && params.id !== 'page')) {
        clearInterval(this.autoSaveInterval);
        this.getEntry(params.id.toString());
      }
      setTimeout((): void => {
        this.updateTitle();
      });
    });
  }

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
      start_publication: data.start_publication,
      cover_image: data.media.cover_image ? data.media.cover_image.id : null,
      meta_description: data.meta_description,
    });
    this.coverImage = data.media.cover_image;
    this.oldForm = this.form.value;
    this.updateTitle();
  }

  /**
   * On editor creation callback
   *
   * @param editor Quill instance
   */
  onEditorInit(editor: Quill): void {

    // Editor instance
    this.editor = editor;

    // Fix editor dropdowns on small screens
    // if (window.innerWidth < 992) {
    //   const pickerElements: HTMLCollection = this.elementRef.nativeElement.getElementsByClassName('ql-picker');
    //   for (const element of pickerElements) {
    //     const parent: Element = element;
    //
    //     this.rd.listen(parent.firstChild, 'click', (event: MouseEvent): void => {
    //       const dropdown: HTMLElement = this.rd.nextSibling(event.target);
    //       this.rd.setStyle(dropdown, 'position', 'fixed');
    //       this.rd.setStyle(dropdown, 'top', '50px');
    //       this.rd.setStyle(dropdown, 'left', `${parent.getBoundingClientRect().left}px`);
    //       this.rd.setStyle(dropdown, 'minWidth', 'auto');
    //
    //       const width: number = dropdown.offsetWidth;
    //       const rect: DOMRect = dropdown.getBoundingClientRect() as DOMRect;
    //
    //       if (rect.x < 0 || (rect.x + width) > window.innerWidth) {
    //         if ((rect.x + width) > window.innerWidth) {
    //           this.rd.setStyle(dropdown, 'left', window.innerWidth - width);
    //         } else {
    //           this.rd.setStyle(dropdown, 'left', 0);
    //         }
    //       }
    //     });
    //   }
    // }

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
     * Editor embed whitelist
     */
    const embedWhitelist = [
      'https://gist.github.com/',
      'https://www.instagram.com/p/',
      'https://twitter.com/',
      'https://pastebin.com/',
    ];
    /**
     * On clipboard element node pasted
     */
    editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node: HTMLElement, delta: Delta): Delta => {
      const ops: any[] = [];
      delta.ops.forEach((op: any): void => {
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
    editor.clipboard.addMatcher(Node.TEXT_NODE, (node: Text, delta: Delta): Delta => {
      if (WriteComponent.validatePastedVideo(node.data)) {
        delta.ops = [{
          attributes: {
            allow: 'encrypted-media',
            allowfullscreen: 'true',
            frameborder: 0,
            webkitallowfullscreen: true,
            mozallowfullscreen: true,
          },
          insert: {
            video: WriteComponent.pastedVideoEmbed,
          },
        }];
      }

      // If pasted string starts with Gist, Twitter or Instagram then URL then start converting it to embed.
      embedWhitelist.forEach((host: string): void => {
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

    const toolbar: any = editor.getModule('toolbar');
    toolbar.addHandler('image', (): void => {
      const range = editor.getSelection();

      // If user is in the editor
      if (range) {
        this.cursorIndex = range.index + range.length;
      } else {
        this.cursorIndex = 0;
      }
      /**
       * File selection
       */
      this.showFileListModal(true);
    });
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
      this.oldEntry = cloneDeep(data);
      if (data.entrydraft) {
        this.postChanged = true;
        data = data.entrydraft;
        this.translateService.get(['LOADING_DRAFT', 'UNPUBLISHED_CHANGES']).subscribe((response: Params): void => {
          this.toast.warning(response.UNPUBLISHED_CHANGES as string, response.LOADING_DRAFT as string);
        });
      }
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
   * Update entry and navigate back to posts/pages
   */
  goBack(): void {
    if (!equal(this.form.value, this.oldForm)) {
      this.autoSave = true;
      this.save();
    }
    this.router.navigate(['/dash', 'posts']);
  }

  /**
   * Save entry
   *
   * @param status Status of entry
   */
  save(status?: EntryStatus): void {
    const payload: Params = this.form.value;
    payload.content = this.editor.root.innerHTML;
    payload.id = this.id;
    payload.site = BlogService.currentBlog.id;
    if (status !== undefined) {
      payload.status = status;
    }
    /**
     * Check status before updating
     */
    if (this.autoSave) {
      delete payload.status;
    }
    if (this.isEditing) {
      this.updateEntry(payload, status);
    } else {
      this.addEntry(payload, status);
    }
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
      this.loading = false;
      if (!this.autoSave) {
        this.oldEntry = cloneDeep(data);
        this.postChanged = false;
        if (data.entrydraft) {
          data = data.entrydraft;
        }
        this.patchForm(data);
      } else {
        this.postChanged = true;
        this.autoSave = false;
        this.oldForm = this.form.value;
      }
    }, (): void => {
      this.loading = false;
    });
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
   * Delete entry and redirect to posts or pages route based on current entry type
   */
  deleteEntry(): void {
    this.writeService.deleteEntry(this.id).subscribe((): void => {
      /**
       * Get translate key for toaster
       */
      this.translateService.get('TOAST_DELETE').subscribe((response: string): void => {
        this.toast.success(response, this.oldEntry.title);
      });
      /**
       * Redirect to posts or pages route based on current entry type
       */
      this.router.navigate(['../../', this.oldEntry.is_page ? 'pages' : 'posts'], {
        relativeTo: this.activatedRoute,
      });
    });
  }

  /**
   * Revert changes
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
      this.tags = data.results;
    });
  }

  /**
   * Add tag
   *
   * @param tag Tag slugs
   */
  addTag(tag: string): void {
    const tags: string[] = this.tagsControl.value;
    this.tagsControl.setValue([...tags, ...[tag]]);
  }

  /**
   * Remove tag from entry
   *
   * @param slug Tag slug
   */
  removeTag(slug: string): void {
    const newValue: string[] = (this.tagsControl.value as string[])
      .filter((tagSlug: string): boolean => tagSlug !== slug);
    this.tagsControl.setValue(newValue);
  }

  /**
   * @param tagSlug Tag ID
   *
   * @return Determine whether entry has given tag or not
   */
  isTagSelected(tagSlug: string): boolean {
    const tags: string[] = this.tagsControl.value;
    return tags.includes(tagSlug);
  }

  /**
   * Show file selection modal
   *
   * @param isEditorImage Determines whether selecting image for editor or not
   */
  showFileListModal(isEditorImage: boolean): void {
    this.isEditorImage = isEditorImage;
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
    this.fileListModalRef.content.choose.subscribe((file: FileMedia): void => {
      if (this.isEditorImage) {
        this.editor.insertEmbed(this.cursorIndex, 'image', file.file);
        this.editor.setSelection({ index: this.cursorIndex + 1, length: 0 });
      } else {
        this.form.get('cover_image').setValue(file.id);
        this.coverImage = file;
      }
    });
  }

  /**
   * @description
   *
   * Check if key "TAB" || "ENTER" is pressed and focus on editor
   *
   * @param event KeyboardEvent
   *
   * @returns False which will prevent input's default behavior
   */
  preventBreak(event: KeyboardEvent): boolean {
    if (event.key === 'Enter' || event.key === 'Tab') {
      this.editor.focus();

      return false;
    }
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
   * @returns A URL to view an entry on blog
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

  ngOnDestroy(): void {
    clearInterval(this.autoSaveInterval);
  }
}
