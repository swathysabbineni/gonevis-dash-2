import { Component } from '@angular/core';

@Component({
  selector: 'app-page-cover',
  templateUrl: './page-cover.component.html',
  styleUrls: ['./page-cover.component.scss'],
})
export class PageCoverComponent {

  constructor() {
  }

  /**
   * Background color class of the cover
   */
  color = 'bg-dark';

  /**
   * Height of the cover
   */
  size = '300px';

  /**
   * Size of pull up
   */
  pull = '-150px';
}
