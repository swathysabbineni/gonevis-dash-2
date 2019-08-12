import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Entry } from '@app/interfaces/zero/entry';

@Component({
  selector: 'app-entry-share',
  templateUrl: './entry-share.component.html',
  styleUrls: ['./entry-share.component.scss'],
})
export class EntryShareComponent {

  @ViewChild('shareInput', { static: true }) shareInput: ElementRef;

  /**
   * Entry to share URL for
   */
  @Input() entry: Entry;

  constructor() {
  }

  /**
   * @returns Full URL address of this entry
   */
  get url(): string {
    return `${location.origin}/feed/entry/${this.entry.id}`;
  }
}
