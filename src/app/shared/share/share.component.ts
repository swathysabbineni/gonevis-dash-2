import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Entry } from '@app/interfaces/zero/entry';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent {

  @ViewChild('shareInput') shareInput: ElementRef;

  /**
   * Entry to share URL for
   */
  @Input() entry: Entry;

  /**
   * Link to share
   */
  @Input() link: string;

  /**
   * @returns Full entry path or link
   */
  get url(): string {
    if (this.entry) {
      return this.entry.absolute_uri;
    }
    return this.link;
  }
}
