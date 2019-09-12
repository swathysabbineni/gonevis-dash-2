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
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaService } from '@app/components/dash/media/media.service';
import '@app/components/dash/write/blots/divider.ts';
import '@app/components/dash/write/blots/embed.ts';
import '@app/components/dash/write/blots/soundcloud.ts';
import '@app/components/dash/write/blots/video.ts';
import '@app/components/dash/write/modules/clipboard.ts';
import '@app/components/dash/write/modules/image-drag-drop.ts';
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
import { BlogService } from '@app/services/blog/blog.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { QuillModules } from 'ngx-quill';
import { Quill, Delta as DeltaInterface, RangeStatic } from 'quill';
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
   * Old entry
   */
  private oldEntry: Entry;

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
   * Entry status
   */
  readonly entryStatus = EntryStatus;

  @ViewChild('fileListModalTemplate', { static: false }) fileListModalTemplate: TemplateRef<any>;

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
  tagQueryForm: FormGroup;

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
   * Quill modules
   */
  options: QuillModules = {
    imageDragDrop: true,
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'blockquote', 'code-block', { list: 'bullet' }, 'divider'],
        [{ header: [1, 2, 3, false] }],
        ['image', 'video'],
        [{ direction: 'rtl' }, { align: [] }],
        ['clean'],
      ],
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
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private translateService: TranslateService,
              private mediaService: MediaService,
              private writeService: WriteService) {
  }

  ngOnInit(): void {
    /**
     * Setup entry form
     */
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [[]],
      status: [EntryStatus.Draft],
      comment_enabled: [false],
      featured: [false],
      is_page: [false],
    });
    /**
     * Set up tag query form
     */
    this.tagQueryForm = this.formBuilder.group({ query: '' });
    this.tagQueryForm.get('query').valueChanges.pipe(debounceTime(300)).subscribe((value: string): void => {
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
        this.isEditing = false;
      }
      if (params.id && params.id !== 'new') {
        this.getEntry(params.id.toString());
      }
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
      tags: data.tags,
      status: data.status,
      comment_enabled: data.comment_enabled,
      featured: data.featured,
      is_page: data.is_page,
    });
    this.oldForm = this.form.value;
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
    editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node: HTMLElement, delta: DeltaInterface): DeltaInterface => {
      const ops: Op[] = [];
      delta.ops.forEach((op: Op): void => {
        if (op.insert.hasOwnProperty('image')) {
          this.writeService.getPastedImage(node.getAttribute('src')).subscribe((data: Blob): void => {
            const file: File = new File([data], 'name', { type: data.type });
            this.uploadFile(file);
          });
          return new Delta();
        }
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
         * Check insert whitelistO
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
    editor.clipboard.addMatcher(Node.TEXT_NODE, (node: Text, delta: DeltaInterface): DeltaInterface => {
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
       * @todo - Add file selection
       */
      this.showFileListModal(this.fileListModalTemplate);
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
      }
      this.patchForm(data);
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
    if (this.isEditing) {
      this.updateEntry(status);
    } else {
      this.addEntry(status);
    }
  }


  /**
   * Update entry
   *
   * @param status Status of entry
   */
  updateEntry(status?: EntryStatus): void {
    this.loading = true;
    const payload: Params = this.form.value;
    payload.id = this.id;
    payload.site = BlogService.currentBlog.id;
    payload.tag_ids = (this.tagsControl.value as TagMin[]).map((tag: TagMin): string => tag.slug);
    if (status !== undefined) {
      payload.status = status;
    }
    /**
     * Check status before updating
     */
    if (this.autoSave) {
      delete payload.status;
    }
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
   * @param status Status of entry
   */
  addEntry(status?: EntryStatus): void {
    if (this.form.get('title').value.trim() === '') {
      this.form.get('title').setValue(`Untitled ${new Date().toDateString()}`);
    }
    const payload: Params = this.form.value;
    payload.site = BlogService.currentBlog.id;
    if (status !== undefined) {
      payload.status = status;
    }
    /**
     * Check status before updating
     */
    if (status === EntryStatus.UnsavedChanges) {
      delete payload.status;
    }
    this.writeService.addEntry(this.form.value).subscribe((data: Entry): void => {
      this.loading = false;
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
    this.updateEntry();
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
   * @param slug Tag slug
   */
  removeTag(slug: string): void {
    this.tagsControl.setValue((this.tagsControl.value as TagMin[]).filter((tag: TagMin): boolean => tag.slug !== slug));
  }

  /**
   * @param tagId Tag ID
   *
   * @return Determine whether entry has given tag or not
   */
  isTagSelected(tagId: string): boolean {
    return (this.tagsControl.value as TagMin[]).some((tag: Tag): boolean => tag.slug === tagId);
  }

  /**
   * Show file selection modal
   */
  showFileListModal(template: TemplateRef<any>): void {
    this.fileListModalRef = this.modalService.show(template, {
      class: 'modal-lg',
    });
  }

  /**
   * On file selection
   *
   * @param file Selected file
   */
  onFileSelect(file: FileMedia) {
    this.fileListModalRef.hide();
    this.editor.insertEmbed(this.cursorIndex, 'image', file.file);
    this.editor.setSelection({ index: this.cursorIndex + 1, length: 0 });
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSaveInterval);
  }
}
