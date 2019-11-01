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
import '@app/components/dash/write/modules/image-drag-drop.ts';
import '@app/components/dash/write/themes/bootstrap.ts';
import { WriteService } from '@app/components/dash/write/write.service';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { ApiResponse } from '@app/interfaces/api-response';
import { File as FileMedia } from '@app/interfaces/file';
import { Params } from '@app/interfaces/params';
import { SoundCloudEmbed } from '@app/interfaces/sound-cloud-embed';
import { Entry } from '@app/interfaces/v1/entry';
import { Tag } from '@app/interfaces/v1/tag';
import { TagMin } from '@app/interfaces/v1/tag-min';
import { UploadUrlResponse } from '@app/interfaces/v1/upload-url-response';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { QuillModules } from 'ngx-quill';
import { ToastrService } from 'ngx-toastr';
import { Quill, RangeStatic } from 'quill';
import Delta from 'quill-delta';
import Op from 'quill/node_modules/quill-delta/dist/Op';
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
  private autoSaveInterval: number;

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

  @ViewChild('fileListModalTemplate', { static: false }) private fileListModalTemplate: TemplateRef<any>;

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
    imageDragDrop: true,
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
    this.pastedVideoEmbed = null;
    clipboard.match(/^(http:\/\/|https:\/\/|)(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
    let isValid = false;
    // Check URL regex
    if (RegExp.$3.indexOf('youtu') > -1) {
      WriteComponent.pastedVideoEmbed = `https://www.youtube.com/embed/${RegExp.$6}?autoplay=0`;
      isValid = true;
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
      WriteComponent.pastedVideoEmbed = `https://player.vimeo.com/video/${RegExp.$6}`;
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
    BlogService.blog.subscribe((blog: BlogMin): void => {
      if (!blog) {
        return;
      }
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
        if (params.id === 'new') {
          this.form.reset({
            title: '',
            content: '',
            excerpt: '',
            tags: [],
            status: EntryStatus.Draft,
            slug: '',
            comment_enabled: true,
            featured: false,
            is_page: false,
            start_publication: null,
            cover_image: null,
            meta_description: '',
          });
          clearInterval(this.autoSaveInterval);
          this.isEditing = false;
          this.initAutoSave();
        }
        if (params.id && params.id !== 'new') {
          clearInterval(this.autoSaveInterval);
          this.getEntry(params.id.toString());
        }
        setTimeout((): void => {
          this.updateTitle();
        });
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
   * Upload file and insert image
   *
   * @param file File to upload
   */
  private uploadFile(file: File): void {
    const range: RangeStatic = this.editor.getSelection(true);
    this.mediaService.uploadUrl({
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    }).subscribe((response: UploadUrlResponse): void => {
      this.mediaService.uploadToUrl(
        response.post_data.url,
        file,
        response.post_data.fields,
      ).subscribe((fileMedia: void | FileMedia): void => {
        if (environment.name === 'local') {
          this.editor.insertEmbed(range.index, 'image', (fileMedia as FileMedia).file);
        } else {
          this.mediaService.post(
            response.post_data.fields.key,
          ).subscribe((fileUploaded: FileMedia): void => {
            this.editor.insertEmbed(range.index, 'image', fileUploaded.file);
          });
        }
      });
    });
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
      const ops: Op[] = [];
      delta.ops.forEach((op: Op): void => {
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
    editor.getModule('imageDragDrop').file().subscribe((data: File): void => {
      this.uploadFile(data);
    });
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
      this.showFileListModal(this.fileListModalTemplate, true);
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
      this.editor['history'].clear();
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
    payload.tag_ids = (this.tagsControl.value as TagMin[]).map((tag: TagMin): string => tag.id);
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
   * @param tag Tag to add
   */
  addTag(tag: Tag): void {
    const tags: TagMin[] = this.tagsControl.value;
    this.tagsControl.setValue([...tags, ...[tag]]);
  }

  /**
   * Remove tag from entry
   *
   * @param id Tag ID
   */
  removeTag(id: string): void {
    this.tagsControl.setValue((this.tagsControl.value as TagMin[]).filter((tag: TagMin): boolean => tag.id !== id));
  }

  /**
   * @param tagId Tag ID
   *
   * @return Determine whether entry has given tag or not
   */
  isTagSelected(tagId: string): boolean {
    return (this.tagsControl.value as TagMin[]).some((tag: Tag): boolean => tag.id === tagId);
  }

  /**
   * Show file selection modal
   *
   * @param template Template to show as a modal
   * @param isEditorImage Determines whether selecting image for editor or not
   */
  showFileListModal(template: TemplateRef<any>, isEditorImage: boolean): void {
    this.isEditorImage = isEditorImage;
    this.fileListModalRef = this.modalService.show(template, {
      class: 'modal-lg',
    });
  }

  /**
   * On file selection
   *
   * @param file Selected file
   */
  onFileSelect(file: FileMedia): void {
    this.fileListModalRef.hide();
    if (this.isEditorImage) {
      this.editor.insertEmbed(this.cursorIndex, 'image', file.file);
      this.editor.setSelection({ index: this.cursorIndex + 1, length: 0 });
    } else {
      this.form.get('cover_image').setValue(file.id);
      this.coverImage = file;
    }
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

  ngOnDestroy(): void {
    clearInterval(this.autoSaveInterval);
  }
}
