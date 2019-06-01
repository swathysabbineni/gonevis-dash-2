import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-entry-share',
  templateUrl: './entry-share.component.html',
  styleUrls: ['./entry-share.component.scss'],
})
export class EntryShareComponent implements OnInit {

  /**
   * Share URL
   */
  @Input() url: string;

  constructor() {
  }

  ngOnInit() {
  }

}
