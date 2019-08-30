import { Component, OnInit, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import '@app/components/dash/write/blots/divider.ts';
import '@app/components/dash/write/blots/embed.ts';
import '@app/components/dash/write/blots/soundcloud.ts';
import '@app/components/dash/write/blots/video.ts';
import '@app/components/dash/write/modules/clipboard.ts';
import { WriteService } from '@app/components/dash/write/write.service';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { ApiResponse } from '@app/interfaces/api-response';
import { Params } from '@app/interfaces/params';
import { Entry } from '@app/interfaces/v1/entry';
import { Tag } from '@app/interfaces/v1/tag';
import { BlogService } from '@app/services/blog/blog.service';
import { TranslateService } from '@ngx-translate/core';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';
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
export class WriteComponent implements OnInit {

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
   * Entry status
   */
  readonly entryStatus = EntryStatus;

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
   * Entry
   */
  entry: Entry = {
    title: '',
    content: '',
    site: BlogService.currentBlog.id,
    status: EntryStatus.Draft,
    tags: [],
    tag_ids: [],
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
              private translateService: TranslateService,
              private writeService: WriteService) {
  }

  ngOnInit(): void {
    /**
     * Setup entry form
     */
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
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
   * Update form controls
   *
   * @param data Entry
   */
  private patchForm(data: Entry): void {
    this.form.patchValue({
      title: data.title,
      content: data.content,
      status: data.status,
      comment_enabled: data.comment_enabled,
      featured: data.featured,
      is_page: data.is_page,
    });
    this.oldForm = this.form.value;
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
        this.writeService.getSoundCloud(node.data).subscribe((data) => {
          console.log(data);
        });
        // $http.get(`https://soundcloud.com/oembed?format=js&url=${node.data}&iframe=true`).then(data => {
        //   let rawString = data.data.substr(1, data.data.length - 3);
        //   let callback = JSON.parse(rawString);
        //   // Get current selection.
        //   let range = editor.getSelection();
        //   // Insert SoundCloud embed.
        //   editor.insertEmbed(range.index + range.length, 'soundcloud', callback.html);
        //   // Set cursor selection after SoundCloud embed.
        //   editor.setSelection(range.index + range.length + 2);
        // }); https://soundcloud.com/pishroforever/rahbare-rape-fars
        // return { ops: [] };
        return new Delta();
      }

      return delta;
    });
    let cursorIndex = 0;

    const toolbar: any = editor.getModule('toolbar');
    toolbar.addHandler('image', (): void => {
      const range = editor.getSelection();

      // If user is in the editor
      if (range) {
        cursorIndex = range.index + range.length;
      } else {
        cursorIndex = 0;
      }
      /**
       * @todo - Add file selection
       */
      // $scope.dolphinService.viewSelection('editorAddImage');
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
      this.oldEntry = cloneDeep(data);
      if (data.entrydraft) {
        this.postChanged = true;
        data = data.entrydraft;
      }
      this.entry = data;
      this.patchForm(data);
      this.editor['history'].clear();
    });
  }

  /**
   * Update entry and navigate back to posts/pages
   */
  goBack(): void {
    const isEqual: boolean = equal(this.form.value, this.oldForm);
    if (!isEqual) {
      let status: EntryStatus = this.form.get('status').value;
      /**
       * Check if entry is published
       */
      if (status === EntryStatus.Published) {
        status = EntryStatus.UnsavedChanges;
      }
      this.save(status);
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
    this.entry.status = status;
    const payload: Params = this.form.value;
    payload.id = this.id;
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
    this.writeService.updateEntry(payload).subscribe((data: Entry): void => {
      this.loading = false;
      this.entry = data;
      this.oldEntry = cloneDeep(data);
      this.postChanged = !!data.entrydraft;
      if (data.entrydraft) {
        data = data.entrydraft;
      }
      this.patchForm(data);
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
    this.entry.tags.unshift(tag);
    if (this.tagQueryForm.get('query').value !== '') {
      this.tagQueryForm.get('query').reset('');
    }
  }

  /**
   * Remove tag from entry
   *
   * @param tagId Tag ID
   */
  removeTag(tagId: string): void {
    this.entry.tags.splice(this.entry.tags.findIndex((tag: Tag): boolean => tag.id === tagId), 1);
  }

  /**
   * @param tagId Tag ID
   *
   * @return Determine whether entry has given tag or not
   */
  isTagSelected(tagId: string): boolean {
    return this.entry.tags.some((tag: Tag): boolean => tag.id === tagId);
  }
}
