import { Component, OnInit, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import '@app/components/dash/write/blots/divider.ts';
import '@app/components/dash/write/blots/embed.ts';
import '@app/components/dash/write/blots/soundcloud.ts';
import '@app/components/dash/write/blots/video.ts';
import '@app/components/dash/write/modules/clipboard.ts';
import { WriteService } from '@app/components/dash/write/write.service';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { Entry } from '@app/interfaces/v1/entry';
import { TagMin } from '@app/interfaces/v1/tag-min';
import equal from 'deep-equal';
import cloneDeep from 'lodash.clonedeep';
import { QuillModules } from 'ngx-quill';
import { Quill, Delta as DeltaInterface, RangeStatic } from 'quill';
import Delta from 'quill-delta';
import Op from 'quill/node_modules/quill-delta/dist/Op';


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
   * Quill instance
   */
  private editor: Quill;

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
  entry: Entry = post;

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
              private writeService: WriteService) {
  }

  ngOnInit(): void {
    console.log(this.entry);
    /**
     * Make a copy of entry
     */
    this.oldEntry = cloneDeep(this.entry);
    if (this.activatedRoute.firstChild) {
      /**
       * Subscribe to current route's params
       */
      this.activatedRoute.firstChild.params.subscribe((params: Params): void => {
        /**
         * Check entry ID existence
         */
        if (params.id) {
          this.id = params.id;
          this.writeService.getEntry(params.id).subscribe((data: Entry): void => {
            this.oldEntry = cloneDeep(data);
            if (data.entrydraft) {
              data = data.entrydraft;
            }
            this.entry = data;
          });
        }
      });
    }
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
        console.log('s');
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
   * Update entry and navigate back to posts/pages
   */
  goBack(): void {
    let isEqual = equal(this.entry, this.oldEntry);
    /**
     * Check equality
     */
    if (this.oldEntry.entrydraft) {
      isEqual = equal(this.entry, this.oldEntry.entrydraft);
    }
    if (!isEqual) {
      /**
       * Check if entry's status is published
       */
      if (this.entry.status === EntryStatus.Published) {
        delete this.entry.status;
      }
      this.updateEntry();
    } else {
    }
    this.router.navigate(['/dash', 'posts']);
  }

  /**
   * Update entry
   *
   * @param status Status of entry
   */
  updateEntry(status?: number): void {
    this.entry.status = status;
    this.entry.tags.forEach((tag: TagMin): number => this.entry.tag_ids.push(tag.id));
    this.writeService.updateEntry(this.id, this.entry).subscribe((data: Entry): void => {
      this.entry = data;
      this.oldEntry = cloneDeep(data);
    });
  }

  /**
   * Add Entry
   */
  addEntry(): void {

  }
}
